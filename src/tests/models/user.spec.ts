import { BaseAuthUser, BaseUser, User, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('User Model', () => {
  const user: BaseAuthUser = {
    userName: 'ChrisAnne',
    firstName: 'Chris',
    lastName: 'Anne',
    password: 'password123',
  };

  async function createUser(user: BaseAuthUser) {
    return userStore.create(user);
  }

  async function deleteUser(id: number) {
    return userStore.deleteUser(id);
  }

  it('should have an index method', () => {
    expect(userStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(userStore.read).toBeDefined();
  });

  it('should have a create method', () => {
    expect(userStore.create).toBeDefined();
  });

  it('should have a remove method', () => {
    expect(userStore.deleteUser).toBeDefined();
  });

  it('create method should create a user', async () => {
    const createdUser: User = await createUser(user);

    if (createdUser) {
      const { userName, firstName, lastName } = createdUser;

      expect(userName).toBe(user.userName);
      expect(firstName).toBe(user.firstName);
      expect(lastName).toBe(user.lastName);
    }

    await deleteUser(createdUser.id);
  });

  it('index method should return a list of users', async () => {
    const createdUser: User = await createUser(user);
    const userList = await userStore.index();
    expect(userList).toEqual([createdUser]);
    await deleteUser(createdUser.id);
  });

  it('show method should return the correct users', async () => {
    const createdUser: User = await createUser(user);
    const userFromDb = await userStore.read(createdUser.id);
    expect(userFromDb).toEqual(createdUser);
    await deleteUser(createdUser.id);
  });

  it('remove method should remove the user', async () => {
    const createdUser: User = await createUser(user);
    await deleteUser(createdUser.id);
    const userList = await userStore.index();
    expect(userList).toEqual([]);
  });

  it('update method should update the user', async () => {
    const createdUser: User = await createUser(user);
    const newUserData: BaseUser = {
      firstName: 'Kris',
      lastName: 'Han',
    };

    const { firstName, lastName } = await userStore.update(
      createdUser.id,
      newUserData
    );

    expect(firstName).toEqual(newUserData.firstName);
    expect(lastName).toEqual(newUserData.lastName);

    await deleteUser(createdUser.id);
  });

  it('authenticates the user with a password', async () => {
    const createdUser: User = await createUser(user);

    const userFromDb = await userStore.authenticate(
      user.userName,
      user.password
    );

    if (userFromDb) {
      const { userName, firstName, lastName } = userFromDb;

      expect(userName).toBe(user.userName);
      expect(firstName).toBe(user.firstName);
      expect(lastName).toBe(user.lastName);
    }

    await deleteUser(createdUser.id);
  });
});
