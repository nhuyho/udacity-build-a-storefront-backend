import { BaseOrder } from '../../models/order';
import app from '../../server';
import { Secret } from 'jsonwebtoken';
import request from 'supertest';

// const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('Order Handler', () => {
  let token: string;
  let order: BaseOrder;
  let user_id: number;
  let product_id: number;
  let order_id: number;

  beforeAll(async function () {
    const { body: userBody } = await request(app).post('/users/create').send({
      username: 'ChrisAnne',
      firstname: 'Chris',
      lastname: 'Anne',
      password: 'password123',
    });

    token = userBody;
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    user_id = user.id;

    const { body: productBody } = await request(app)
      .post('/products/create')
      .set('Authorization', 'bearer ' + token)
      .send({
        name: 'Basil Barramunda',
        price: 29,
      });
    product_id = productBody.id;
  });

  afterAll(async function () {
    await request(app)
      .delete(`/users/${user_id}`)
      .set('Authorization', 'bearer ' + token);
    await request(app)
      .delete(`/products/${product_id}`)
      .set('Authorization', 'bearer ' + token);
  });

  it('gets the create endpoint', function (done) {
    request(app)
      .post('/orders/create')
      .send({
        products: [
          {
            product_id,
            quantity: 1,
          },
        ],
        user_id,
        status: true,
      })
      .set({ Authorization: 'bearer ' + token })
      .then((res) => {
        // const { body, status } = res;
        console.log(res);

        expect(res.status).toBe(200);
        order_id = res.body.id;
        done();
      });
  });

  // it('gets the index endpoint', function (done) {
  //   request(app)
  //     .get('/orders')
  //     .set('Authorization', 'bearer ' + token)
  //     .then((res) => {
  //       expect(res.status).toBe(200);
  //       done();
  //     });
  // });

  // it('gets read endpoint', function (done) {
  //   request(app)
  //     .get(`/orders/${order_id}`)
  //     .set('Authorization', 'bearer ' + token)
  //     .then((res) => {
  //       expect(res.status).toBe(200);
  //       done();
  //     });
  // });

  // it('gets the update endpoint', function (done) {
  //   const newOrder: BaseOrder = {
  //     ...order,
  //     status: false,
  //   };

  //   request(app)
  //     .put(`/orders/${order_id}`)
  //     .send(newOrder)
  //     .set('Authorization', 'bearer ' + token)
  //     .then((res) => {
  //       expect(res.status).toBe(200);
  //       done();
  //     });
  // });

  // it('gets the delete endpoint', function (done) {
  //   request(app)
  //     .delete(`/orders/${order_id}`)
  //     .set('Authorization', 'bearer ' + token)
  //     .then((res) => {
  //       expect(res.status).toBe(200);
  //       done();
  //     });
  // });
});
