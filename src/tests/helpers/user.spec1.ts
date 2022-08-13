import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import { BaseAuthUser } from '../../models/user';
import app from '../../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_KEY as Secret;

describe('User Handler', () => {
  const userData: BaseAuthUser = {
    username: 'ChrisAnne',
    firstname: 'Chris',
    lastname: 'Anne',
    password: 'password123',
  };

  let token: string,
    userId = 1;

  // it('should require authorization on every endpoint', (done) => {
  //   request.get('/users').then((res) => {
  //     expect(res.status).toBe(401);
  //     done();
  //   });

  //   request.get(`/users/${userId}`).then((res) => {
  //     expect(res.status).toBe(401);
  //     done();
  //   });

  //   request
  //     .put(`/users/${userId}`)
  //     .send({
  //       firstName: userData.firstname + 'test',
  //       lastName: userData.lastname + 'test',
  //     })
  //     .then((res) => {
  //       expect(res.status).toBe(401);
  //       done();
  //     });

  //   request.delete(`/users/${userId}`).then((res) => {
  //     expect(res.status).toBe(401);
  //     done();
  //   });
  // });

  it('gets the create endpoint', (done) => {
    request
      .post('/users/create')
      .send(userData)
      .then((res) => {
        const { body, status } = res;
        token = body;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { user } = jwt.verify(token, SECRET);
        userId = user.id;

        expect(status).toBe(200);
        done();
      });
  });

  it('gets the index endpoint', (done) => {
    request
      .get('/users')
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('get the read endpoint', (done) => {
    request
      .get(`/users/${userId}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('get the update endpoint', (done) => {
    const newUserData: BaseAuthUser = {
      ...userData,
      firstname: 'Chris',
      lastname: 'Anne',
    };

    request
      .put(`/users/${userId}`)
      .send(newUserData)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('get the auth endpoint', (done) => {
    request
      .post('/users/auth')
      .send({
        username: userData.username,
        password: userData.password,
      })
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('get the auth endpoint with wrong password', (done) => {
    request
      .post('/users/authenticate')
      .send({
        username: userData.username,
        password: 'trtdtxcfcf',
      })
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(401);
        done();
      });
  });

  it('get the delete endpoint', (done) => {
    request
      .delete(`/users/${userId}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
