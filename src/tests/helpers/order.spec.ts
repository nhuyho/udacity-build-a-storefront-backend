/* eslint-disable @typescript-eslint/ban-ts-comment */
import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';
import { BaseOrder, OrderStore } from '../../models/order';
import { BaseProduct } from '../../models/product';
import { BaseAuthUser } from '../../models/user';
import app from '../../server';

const request = supertest(app);

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

    spyOn(OrderStore.prototype, 'update').and.returnValue(
      Promise.resolve({
        id: 2,
        products: [
          {
            product_id: 5,
            quantity: 5,
          },
        ],
        user_id: 3,
        status: false,
      })
    );
  });

  it('should create order endpoint', async (done) => {
    const res = await request
      .post('/orders/create')
      .set('Authorization', 'Bearer ' + token)
      .send({
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

  it('should gets the read endpoint', async (done) => {
    request
      .get(`/orders/1`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('should gets the delete endpoint', async (done) => {
    request
      .delete(`/orders/2`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
