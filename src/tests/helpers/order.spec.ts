import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import { BaseOrder } from '../../models/order';
import { BaseAuthUser } from '../../models/user';
import { BaseProduct } from '../../models/product';
import app from '../../app';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('Order Handler', () => {
  let token: string,
    order: BaseOrder,
    user_id: number,
    product_id: number,
    order_id: number;

  beforeAll(async () => {
    const userData: BaseAuthUser = {
      userName: 'ChrisAnne',
      firstName: 'Chris',
      lastName: 'Anne',
      password: 'password123',
    };
    const productData: BaseProduct = {
      name: 'Basil Barramunda',
      price: 29,
    };

    const { body: userBody } = await request
      .post('/users/create')
      .send(userData);

    token = userBody;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    user_id = user.id;

    const { body: productBody } = await request
      .post('/products/create')
      .set('Authorization', 'bearer ' + token)
      .send(productData);
    product_id = productBody.id;

    order = {
      products: [
        {
          product_id,
          quantity: 1,
        },
      ],
      user_id,
      status: true,
    };
  });

  afterAll(async () => {
    await request
      .delete(`/users/${user_id}`)
      .set('Authorization', 'bearer ' + token);
    await request
      .delete(`/products/${product_id}`)
      .set('Authorization', 'bearer ' + token);
  });

  it('gets the create endpoint', (done) => {
    request
      .post('/orders/create')
      .send(order)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        order_id = body.id;

        done();
      });
  });

  it('gets the index endpoint', (done) => {
    request
      .get('/orders')
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('gets read endpoint', (done) => {
    request
      .get(`/orders/${order_id}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('gets the update endpoint', (done) => {
    const newOrder: BaseOrder = {
      ...order,
      status: false,
    };

    request
      .put(`/orders/${order_id}`)
      .send(newOrder)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('gets the delete endpoint', (done) => {
    request
      .delete(`/orders/${order_id}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});