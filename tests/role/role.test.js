import roles from '../../routes/roles';
import Role from '../../models/role';
import { createDefaultRoles } from '../../startup/db';
import request from 'supertest';
import server from '../../index';
import 'babel-polyfill';
import { notDeepEqual } from 'assert';

//test Creating a role
describe('Roles, /', () => {
  // beforeAll(async () => {
  //   await Role.deleteMany({}); //empty roles collection in db
  // });
  beforeEach(async () => {
    server; //start server
  });
  afterEach(async () => {
    await server.close(); //close server
    await Role.deleteMany({}); //empty roles collection in db
  });

  describe('POST/ ', () => {
    //test that a role must have title
    test('that the created role has title property', async () => {
      const res = await request(server)
        .post('/api/roles')
        .send({ title: 'premium' });
      expect(res.body).toHaveProperty('title');
    }); //test end

    //test that if title is not provided, role should not be created
    test('roles with empty title cannot be created', async () => {
      const res = await request(server)
        .post('/api/roles')
        .send({ title: '' });
      expect(res.status).toBe(400);
    }); //test end

    test('roles without title cannot be created', async () => {
      const res = await request(server)
        .post('/api/roles')
        .send({});
      expect(res.status).toBe(400);
    }); //test end

    //test that admin and regular roles exist
    test('that admin role exist on the system', async () => {
      await createDefaultRoles();

      const admin = await Role.findOne({ title: 'admin' });
      expect(admin).toBeTruthy();
      expect(admin).toHaveProperty('title');
    }); //test end

    test('that user role exist on the system', async () => {
      await createDefaultRoles();
      const user = await Role.findOne({ title: 'user' });
      expect(user).toBeTruthy();
      expect(user).toHaveProperty('title');
    }); //test end

    //test that role title is unique
    test('that title is unique', async () => {
      await createDefaultRoles();
      const res = await request(server)
        .post('/api/roles')
        .send({ title: 'admin' });
      expect(res.status).toBe(400);
      expect(res.body.title).not.toBeTruthy();
    });
  }); //end of describe (POST)
}); //end of describe (Roles)

//test that role can only be created, updated and deleted by admin
//roles can be viewed (admin will not be visible)
