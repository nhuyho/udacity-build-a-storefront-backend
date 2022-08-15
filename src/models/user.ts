import bcrypt from 'bcrypt';
import Client from '../database';

export interface BaseUser {
  firstname: string;
  lastname: string;
}
export interface BaseAuthUser {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}
export interface User extends BaseAuthUser {
  id: number;
}

export class UserStore {
  async getUser(): Promise<User[]> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM users';
      const { rows } = await connection.query(sql);
      connection.release();
      return rows;
    } catch (err) {
      throw new Error(`Can not get users. ${err}`);
    }
  }
  async create(user: BaseAuthUser): Promise<User> {
    const { firstname, lastname, username, password } = user;

    try {
      const sql =
        'INSERT INTO users (firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(
        password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT_ROUNDS as string, 10)
      );
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [firstname, lastname, username, hash]);

      connection.release();

      return rows[0];
    } catch (err) {
      throw new Error(`Could not add new user ${firstname} ${lastname}. ${err}`);
    }
  }

  async read(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. ${err}`);
    }
  }

  async update(id: number, newUserData: BaseUser): Promise<User> {
    try {
      const sql = 'UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [
        newUserData.firstname,
        newUserData.lastname,
        id,
      ]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(
        `Could not update user ${newUserData.firstname} ${newUserData.lastname}. ${err}`
      );
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';
      const connection = await Client.connect();
      await connection.query(sql, [id]);
      connection.release();
      return true;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT password_digest FROM users WHERE username=($1)';
      const conn = await Client.connect();
      const { rows } = await conn.query(sql, [username]);

      if (rows.length > 0) {
        const user = rows[0];
        if (bcrypt.compareSync(password + process.env.BCRYPT_PASSWORD, user.password_digest)) {
          return user;
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Could not find user ${username}. ${err}`);
    }
  }
}
