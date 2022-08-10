import bcrypt from 'bcrypt';
import Client from '../database';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export interface BaseUser {
  firstName: string;
  lastName: string;
}
export interface BaseAuthUser {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
}
export interface User extends BaseAuthUser {
  id: number;
}

export class UserStore {
  async index(): Promise<User[]> {
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

  async create(u: BaseAuthUser): Promise<User> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (firstName, lastName, userName, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );

      const result = await conn.query(sql, [
        u.firstName,
        u.lastName,
        u.userName,
        hash,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`unable create user (${u.userName}): ${err}`);
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
      const sql =
        'UPDATE users SET firstName = $1, lastName = $2 WHERE id = $3 RETURNING *';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [
        newUserData.firstName,
        newUserData.lastName,
        id,
      ]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(
        `Could not update user ${newUserData.firstName} ${newUserData.lastName}. ${err}`
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
      const sql = 'SELECT password_digest FROM users WHERE userName=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [username]);

      if (result.rows.length) {
        const user = result.rows[0];
        if (
          bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)
        ) {
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