import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import mongoose from 'mongoose';
/*TODO: 
Write a test that validates that a new user created is unique.
Write a test that validates that a new user created has a role defined.
Write a test that validates that a new user created has both first and last names.
Write a test that validates that all users are returned only when requested by admin.
 */

describe('users', () => {
  beforeEach(async () => {
    server; //start server
    await User.insertMany([
      {
        name: { first: 'damilare', last: 'solomon' },
        email: 'dare@gmail',
        userName: 'darelawal',
        password: 'sweetlove',
        role: new mongoose.Types.ObjectId()
      }
    ]);
  });
  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
  });
  describe('POST /', () => {
    // validates that a new user created is unique.
    test('that new user cannot use exsitig email', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'dare', last: 'lawal' },
          email: 'dare@gmail',
          userName: 'lawaldare',
          password: 'sweetlove',
          roleId: new mongoose.Types.ObjectId()
        });
      expect(res.status).toBe(400);
    }); //test End

    test('that new user cannot use existing username', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'dare', last: 'lawal' },
          email: 'darelawal@gmail',
          userName: 'darelawal',
          password: 'sweetlove',
          roleId: new mongoose.Types.ObjectId()
        });
      expect(res.status).toBe(400);
    });
  }); //end of describe('POST')
}); //end of describe('users')
