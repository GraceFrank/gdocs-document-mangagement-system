import roles from '../../routes/roles';
import Role from '../../models/role';
import { createDefaultRoles } from '../../startup/db';
import request from 'supertest';
import server from '../../index';
import 'babel-polyfill';

//test Creating a role
describe('Roles, /', () => {
  beforeEach(async () => {
    server; //start server
  });
  afterEach(async () => {
    await server.close(); //close server
    await Role.remove({}); //empty roles collection in db
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
      const admin = await Role.findOne({ title: 'admin' });
      expect(admin).toBeTruthy();
      expect(admin).toHaveProperty('title');
    }); //test end
  }); //end of describe (POST)
}); //end of describe (Roles)

//test that role can only be created, updated and deleted by admin
//test that role title is unique
//roles can be viewed (admin will not be visible)
