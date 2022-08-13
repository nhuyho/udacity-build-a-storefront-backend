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

  let token: string, userId: number, productId: number;

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
    await request
      .delete(`/users/${userId}`)
      .set('Authorization', 'bearer ' + token);
  });

  it('gets the create endpoint', (done) => {
    request
      .post('/products/create')
      .send(product)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        const { body, status } = res;

        expect(status).toBe(200);

        productId = body.id;
        done();
      });
  });

  it('gets the index endpoint', (done) => {
    request.get('/products').then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it('gets the read endpoint', (done) => {
    request.get(`/products/${productId}`).then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it('gets the update endpoint', (done) => {
    const newProductData: BaseProduct = {
      ...product,
      name: 'Angular Book',
      price: 1909,
    };

    request
      .put(`/products/${productId}`)
      .send(newProductData)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('gets the delete endpoint', (done) => {
    request
      .delete(`/products/${productId}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
