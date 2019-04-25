import roles from '../../routes/roles';
import Role from '../../models/role';
import request from 'supertest';
import server from '../../index';
import 'babel-polyfill';

//test Creating a role
describe('Roles, /', () => {
  beforeEach(() => {
    const server = server;
  });
  afterEach(async () => {
    await server.close();
  });

  describe('POST/ ', () => {
    test('that the created role has title property', async () => {
      const res = await request(server)
        .post('/api/roles')
        .send({ title: 'premium' });
      expect(res.body).toHaveProperty('title');
    });
  });
});
//test that a role must have title

//test tht role res has title property,
//test that if title is not provided, role should not be created
//test that role can only be created by admin
//test that role title is unique
//test that admin and regular roles exist
