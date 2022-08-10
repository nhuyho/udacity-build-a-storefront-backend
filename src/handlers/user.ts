import { Application, Request, Response } from 'express';
import { verifyToken, getTokenByUser } from '../handlers/helpers';
import { User, UserStore } from '../models/user';

const userStore = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const users: User[] = await userStore.index();
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName as unknown as string;
    const lastName = req.body.lastName as unknown as string;
    const userName = req.body.userName as unknown as string;
    const password = req.body.password as unknown as string;

    if (!firstName || !lastName || !userName || !password) {
      res.status(400);
      res.send(
        'Some required parameters are missing! eg. :firstName, :lastName, :userName, :password'
      );
      return false;
    }
    const user: User = await userStore.create({
      firstName,
      lastName,
      userName,
      password,
    });

    res.json(getTokenByUser(user));
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      return res.status(400).send('Missing required parameter :id.');
    }
    const user: User = await userStore.read(id);
    res.json(user);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const firstName = req.body.firstName as unknown as string;
    const lastName = req.body.lastName as unknown as string;
    if (!firstName || !lastName || !id) {
      res.status(400);
      res.send(
        'Some required parameters are missing! eg. :firstName, :lastName, :id'
      );
      return false;
    }
    const user: User = await userStore.update(id, {
      firstName,
      lastName,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400).send('Missing required parameter :id.');
      return false;
    }
    await userStore.deleteUser(id);
    res.send(`User with id ${id} successfully deleted.`);
  } catch (err) {
    res.status(400).json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const username = (req.body.userName as unknown as string) || 'ChrissAnne';
    const password = (req.body.password as unknown as string) || 'password123';
    if (!username || !password) {
      res.status(400);
      res.send(
        'Some required parameters are missing! eg. :username, :password'
      );
      return false;
    }
    const user: User | null = await userStore.authenticate(username, password);
    if (!user) {
      return res.status(401).send(`Wrong password for user ${username}.`);
    }
    res.json(getTokenByUser(user));
  } catch (err) {
    res.status(400).json(err);
  }
};

export default function userRoutes(app: Application) {
  app.get('/users', index);
  app.get('/users/:id', read);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.put('/users/:id', verifyToken, update);
  app.delete('/users/:id', verifyToken, deleteUser);
}
