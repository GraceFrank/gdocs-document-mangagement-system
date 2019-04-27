import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import Role from '../../models/role';
import { Mongoose } from 'mongoose';

//Todo:
/**
 * user can , update,  and delete their account
 TODO: later
 that it actuall deletes or update users in db
test that user actually saves to database
test that admin can get a user by a given id
 */
let regular;
let admin;
let randomUser;
describe('users', () => {
  beforeEach(async () => {
    server; //start server
    await Role.insertMany([{ title: 'regular' }, { title: 'admin' }]);
    regular = await Role.findOne({ title: 'regular' });
    admin = await Role.findOne({ title: 'admin' });

    await User.insertMany([
      {
        name: { first: 'damilare', last: 'solomon' },
        email: 'dare@mail.com',
        userName: 'darelawal',
        password: 'sweetlove',
        role: regular._id
      },
      {
        name: { first: 'user11', last: 'solomon' },
        email: 'user11@mail.com',
        userName: 'user11',
        password: 'sweetlove',
        role: admin._id
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
          email: 'dare@mail.com',
          userName: 'lawaldare',
          password: 'sweetlove',
          role: regular._id
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

  describe('GET/', () => {
    test('that admin can view all users', async () => {
      const token = new User({ role: admin._id }).generateToken();
      const res = await request(server)
        .get('/api/users')
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
    });
    test('that a non-admin cannot  view all users', async () => {
      const token = new User({ role: regular._id }).generateToken();
      const res = await request(server)
        .get('/api/users')
        .set('x-auth-token', token);
      expect(res.status).toBe(403);
    });
  });

  //test for user to view account
  describe('GET/me', () => {
    test('that logged in user can view his details', async () => {
      const token = new User({ role: regular._id }).generateToken();
      const res = await request(server)
        .get('/api/users/me')
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
    }); //test end;

    test('that user not logged in can view details details', async () => {
      const res = await request(server).get('/api/users/me');
      expect(res.status).toBe(401);
    }); //test end;
  });

  describe('PUT/', () => {
    beforeEach(async () => {
      randomUser = await User.create({
        name: { first: 'user1', last: 'lawal' },
        email: 'user22gmail',
        userName: 'user22',
        password: 'sweetlove',
        role: regular._id
      });
    });
    it('should return a status of 200 when valid properties are passed ', async () => {
      const token = randomUser.generateToken();
      const res = await request(server)
        .put('/api/users')
        .set('x-auth-token', token)
        .send({
          name: { first: 'user12', last: 'lawal' },
          email: 'user12@gmail.com',
          userName: 'user1',
          password: 'sweetlove'
        });
      expect(res.status).toBe(200);
    }); //test end

    it('should return a status of 401 when user is not logged in ', async () => {
      const res = await request(server)
        .put('/api/users')
        .send({
          name: { first: 'user12', last: 'lawal' },
          email: 'user12gmai',
          userName: 'user1',
          password: 'sweetlove'
        });
      expect(res.status).toBe(401);
    }); //test end
  });
}); //end of describe('users')
