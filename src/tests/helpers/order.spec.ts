/* eslint-disable @typescript-eslint/ban-ts-comment */
import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { BaseOrder, OrderStore } from '../../models/order';
import { BaseProduct } from '../../models/product';
import { BaseAuthUser } from '../../models/user';
import app from '../../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('Order Handler', () => {
  let token: string;

  beforeAll(async () => {
    const userData: BaseAuthUser = {
      username: 'ChrisAnne',
      firstname: 'Chris',
      lastname: 'Anne',
      password: 'password123',
    };

    const productData: BaseProduct = {
      name: 'Shoes',
      price: 234,
    };

    const { body: userBody } = await request.post('/users/create').send(userData);

    token = userBody;
    spyOn(OrderStore.prototype, 'create').and.returnValue(
      Promise.resolve({
        id: 1,
        products: [
          {
            product_id: 5,
            quantity: 5,
          },
        ],
        user_id: 3,
        status: true,
      })
    );
  });

  it('should create order endpoint', async (done) => {
    const res = await request.post('/orders/create').set('Authorization', 'Bearer ' + token);
    console.log(res.body);
    console.log(res);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      products: [
        {
          product_id: 5,
          quantity: 5,
        },
      ],
      user_id: 3,
      status: true,
    });
    done();
  });

  it('gets the index endpoint', async (done) => {
    request
      .get('/orders')
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('gets the read endpoint', async (done) => {
    request
      .get(`/orders/1`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('gets the update endpoint', async (done) => {
    const updateOrder = {
      products: [
        {
          product_id: 1,
          quantity: 7,
        },
      ],
      user_id: 3,
      status: true,
    };
    request
      .put(`/orders/1`)
      .send({ id: 1, ...updateOrder, status: false })
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('gets the delete endpoint', async (done) => {
    request
      .delete(`/orders/1`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
