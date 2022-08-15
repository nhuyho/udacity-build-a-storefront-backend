import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { BaseProduct } from '../../models/product';
import { BaseAuthUser } from '../../models/user';
import app from '../../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('Product Handler', () => {
  const product: BaseProduct = {
    name: 'Basil Barramunda',
    price: 29,
  };

  let token: string, userId: number;

  beforeAll(async () => {
    const userData: BaseAuthUser = {
      username: 'ChrisAnne',
      firstname: 'Chris',
      lastname: 'Anne',
      password: 'password123',
    };

    const { body } = await request.post('/users/create').send(userData);
    token = body;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(body, SECRET);
    userId = user.id;
  });

  afterAll(async () => {
    await request.delete(`/users/${userId}`).set('Authorization', 'bearer ' + token);
  });

  it('gets the create endpoint', async (done) => {
    const res = await request
      .post('/products/create')
      .send(product)
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('gets the index endpoint', async (done) => {
    const res = await request.get('/products');
    expect(res.status).toBe(200);
    done();
  });

  it('gets the read endpoint', async (done) => {
    const res = await request.get(`/products/2`);
    expect(res.status).toBe(200);
    done();
  });

  it('gets the update endpoint', async (done) => {
    const newProductData: BaseProduct = {
      ...product,
      name: 'Shoes',
      price: 234,
    };
    const res = await request
      .put(`/products/1`)
      .send(newProductData)
      .set('Authorization', 'bearer ' + token);

    expect(res.status).toBe(200);
    done();
  });

  it('gets the delete endpoint', async (done) => {
    const res = await request.delete(`/products/2`).set('Authorization', 'bearer ' + token);
    expect(res.status).toBe(200);
    done();
  });
});
