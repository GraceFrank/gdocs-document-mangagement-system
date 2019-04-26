import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import mongoose from 'mongoose';
import Role from '../../models/role';

/*TODO: 

Write a test that validates that all users are returned only when requested by admin.

todo later
test that user actually saves to database
test that invalid properties cannot be used to create user
 */
let regular;
let admin;
describe('users', () => {
  beforeEach(async () => {
    server; //start server
    await Role.insertMany([{ title: 'regular' }, { title: 'admin' }]);
    regular = await Role.findOne({ title: 'regular' });
    admin = await Role.findOne({ title: 'admin' });

    await User.insertMany([
      {
        name: { first: 'damilare', last: 'solomon' },
        email: 'dare@gmail',
        userName: 'darelawal',
        password: 'sweetlove',
        role: regular._id
      }
    ]);
  });
  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
    await Role.deleteMany({});
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
          password: 'sweetlove'
        });
      expect(res.status).toBe(400);
    }); //test End

    test('that new user cannot use exsitig username', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'dare', last: 'lawal' },
          email: 'darelawal@gmail',
          userName: 'darelawal',
          password: 'sweetlove'
        });
      console.log(res.body);
      expect(res.status).toBe(400);
    }); //test End

    test('that new user created has role defined', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'user1', last: 'lawal' },
          email: 'user1@gmail',
          userName: 'user1',
          password: 'sweetlove'
        });

      expect(res.body).toHaveProperty('role');
      expect(res.body.role).toBe(regular._id.toHexString());
    }); //test end

    // validate that a new user created has both first and last names.
    test('that new user created has role both first and last name defined', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'user2', last: 'lawal' },
          email: 'user2@gmail',
          userName: 'user2',
          password: 'sweetlove'
        });

      expect(res.body).toHaveProperty('name');
      expect(res.body.name).toHaveProperty('first', 'user2');
      expect(res.body.name).toHaveProperty('last', 'lawal');
    }); //test end

    // validate that a new user with admin role can be create when valid id is passed.
    test('that new user created has role both first and last name defined', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'user2', last: 'lawal' },
          email: 'user2@gmail',
          userName: 'user2',
          password: 'sweetlove',
          roleId: admin._id
        });
      expect(res.status).toBe(201);
    }); //test end

    it('should return a 400 if invalid properties are passed ', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'user1', last: 'lawal' },
          email: 'user1gmail',
          userName: 'user1',
          password: 'sweetlove'
        });
      expect(res.status).toBe(400);
    }); //test end
  }); //end of describe('POST')
}); //end of describe('users')
