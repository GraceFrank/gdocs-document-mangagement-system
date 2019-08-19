const mongoose = require('mongoose');
const request = require('supertest');
let server;
let Role = require('../../server/models/role');
let User = require('../../server/models/user');

async function sendRequest({ requestUrl, requestType, role, requestBody }) {
  const token = role ? new User({ role: role }).generateToken() : '';
  return await request(server)
    [requestType](requestUrl || '/api/roles')
    .set('x-auth-token', token)
    .send(requestBody);
}
//test Creating a role

describe('Roles, /', () => {
  let regularUser;
  let adminUser;
  let admin;
  let regular;
  beforeEach(async () => {
    //start server
    server = await require('../../server/index')();
    await Role.deleteMany({}); //empty roles collection in db
    await User.deleteMany({});
    regular = await Role.create({ title: 'regular' });
    admin = await Role.create({ title: 'admin' });

    regularUser = await User.create({
      name: { first: 'user1', last: 'solomon' },
      email: 'user30@mail.com',
      userName: 'user30',
      password: 'sweetlove',
      role: regular._id
    });
    adminUser = await User.create({
      name: { first: 'user2', last: 'solomon' },
      email: 'user23@mail.com',
      userName: 'user23',
      password: 'sweetlove',
      role: admin._id
    });
  });

  afterEach(async () => {
    //close server
    await server.close();
  });

  describe('POST/ ', () => {
    // test that a role must have title
    test('that the created role has title property', async () => {
      const res = await sendRequest({
        requestType: 'post',
        role: admin._id,
        requestBody: { title: 'premium' }
      });
      expect(res.body.data).toHaveProperty('title');
    }); //test end

    // test that if title is not provided, role should not be created
    test('roles with empty title cannot be created', async () => {
      const res = await sendRequest({
        requestType: 'post',
        role: admin._id,
        requestBody: { title: '' }
      });
      expect(res.status).toBe(400);
    }); //test end

    test('roles without title cannot be created', async () => {
      const res = await sendRequest({
        requestType: 'post',
        role: admin._id,
        requestBody: { title: '' }
      });
      expect(res.status).toBe(400);
    }); //test end

    //test that role title is unique
    test('that title is unique', async () => {
      const res = await sendRequest({
        requestType: 'post',
        role: admin._id,
        requestBody: { title: 'admin' }
      });
      expect(res.body.title).not.toBeTruthy();
    });

    //test that a only admin can create  a user
    test('that a non admin cant create a role', async () => {
      const res = await sendRequest({
        requestType: 'post',
        role: regular._id,
        requestBody: { title: 'premium' }
      });
      expect(res.status).toBe(403);
    }); //test end
  }); //end of describe (POST)

  describe('GET /', () => {
    //happy path
    it('should return a 200 ', async () => {
      const res = await sendRequest({
        requestType: 'get',
        role: admin._id
      });
      expect(res.status).toBe(200);
    });
    it('should return all roles', async () => {
      const res = await sendRequest({
        requestType: 'get',
        role: admin._id
      });
      expect(res.body.data.length).toBe(2);
      expect(
        res.body.data.some(value => {
          return value.title === 'regular';
        })
      ).toBeTruthy();
      expect(
        res.body.data.some(value => {
          return value.title === 'admin';
        })
      ).toBeTruthy();
    });
  });

  describe('get/:id', () => {
    test('that role can be retrive by its id', async () => {
      const res = await sendRequest({
        requestUrl: `/api/roles/${admin._id}`,
        requestType: 'get',
        role: admin._id
      });
      expect(res.status).toBe(200);
    });
    test('that only admin can fetch a role by its id', async () => {
      const res = await sendRequest({
        requestUrl: `/api/roles/${regular._id}`,
        requestType: 'get',
        role: regular._id
      });
      expect(res.status).toBe(403);
    });
  });

  describe('put/:id', () => {
    test('that admin can update a role', async () => {
      const res = await sendRequest({
        requestUrl: `/api/roles/${regular._id}`,
        requestType: 'put',
        role: admin._id,
        requestBody: { title: 'vip' }
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('title');
    }); //test end

    test('that non-admin cannot update a role', async () => {
      const res = await sendRequest({
        requestUrl: `/api/roles/${regular._id}`,
        requestType: 'put',
        role: regular._id,
        requestBody: { title: 'vip' }
      });

      expect(res.status).toBe(403);
    }); //test end

    test('that updated title is unique ', async () => {
      const res = await sendRequest({
        requestUrl: `/api/roles/${regular._id}`,
        requestType: 'put',
        role: admin._id,
        requestBody: { title: 'admin' }
      });
      expect(res.status).toBe(409);
    }); //test end

    test('that a status code of 404 is returned when role with given id does not exist ', async () => {
      const res = await sendRequest({
        requestUrl: `/api/roles/${new mongoose.Types.ObjectId()}`,
        requestType: 'put',
        role: admin._id,
        requestBody: { title: 'vip' }
      });
      expect(res.status).toBe(404);
    }); //test end

    test('that a status code of 400 is returned when invalid payload is received from client ', async () => {
      const res = await sendRequest({
        requestUrl: `/api/roles/${new mongoose.Types.ObjectId()}`,
        requestType: 'put',
        role: admin._id,
        requestBody: { title: '' }
      });
      expect(res.status).toBe(400);
    }); //test end
  });
}); //end of describe (Roles)
