const request = require('supertest');
let server;
const Role = require('../../server/models/role');
const User = require('../../server/models/user');

//Todo:
/**
 TODO: later
 that it actual deletes or update users in db
test that user actually saves to database
test that admin can get a user by a given id
 */
let regular;
let admin;
let randomUser;
describe('users', () => {
  beforeEach(async () => {
    //start server
    server = await require('../../server/index')();
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
      expect(res.status).toBe(409);
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

      expect(res.body.data).toHaveProperty('role');
      expect(res.body.data.role).toBe(regular._id.toHexString());
    }); //test end

    // validate that a new user created has both first and last names.
    test('that new user created has  both first and last name defined', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'user2', last: 'lawal' },
          email: 'user2@gmail',
          userName: 'user2',
          password: 'sweetlove'
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data.name).toHaveProperty('first', 'user2');
      expect(res.body.data.name).toHaveProperty('last', 'lawal');
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
      const user = await User.findOne({ email: 'dare@mail.com' });
      const token = user.generateToken();
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
    it('should return a status of 400 when invalid properties are passed in the payload ', async () => {
      const token = randomUser.generateToken();
      const res = await request(server)
        .put('/api/users')
        .set('x-auth-token', token)
        .send({
          name: { first: 'user12', last: 'lawal' },
          email: 'user12gmail.com',
          userName: 'user1',
          password: 'sweetlove'
        });
      expect(res.status).toBe(400);
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
  }); //put

  describe('DELETE/', () => {
    beforeEach(async () => {
      randomUser = await User.create({
        name: { first: 'user1', last: 'lawal' },
        email: 'user22gmail',
        userName: 'user22',
        password: 'sweetlove',
        role: regular._id
      });
    });

    it('should return a status of 200 when Logged in user attempts to delete ', async () => {
      const token = randomUser.generateToken();
      const res = await request(server)
        .delete('/api/users')
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
    }); //test end

    it('should return a status of 401 when  user is not Logged in ', async () => {
      const token = randomUser.generateToken();
      const res = await request(server).delete('/api/users');
      expect(res.status).toBe(401);
    }); //test end
  }); //DELETE
}); //end of describe('users')
