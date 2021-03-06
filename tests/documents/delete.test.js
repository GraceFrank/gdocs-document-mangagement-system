import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import Role from '../../models/role';
import Document from '../../models/document';
import mongoose from 'mongoose';

let doc1;
let user1;

describe('documents/put', () => {
  beforeEach(async () => {
    server; //start server
    const regular = await Role.create({ title: 'regular' });

    user1 = await User.create({
      name: { first: 'nnamdi', last: 'lawal' },
      email: '66nnamdi@mail.com',
      userName: '66nnamdi',
      password: 'sweetlove',
      role: regular._id
    });

    doc1 = await Document.create({
      access: 'role',
      ownerId: user1._id,
      title: 'Document1',
      content: 'Document',
      role: regular._id
    });

    //old document that is created  by user1 to already in db before test
  });

  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
    await Role.deleteMany({});
    await Document.deleteMany({});
  });

  test('that it deletes from db', async () => {
    const token = user1.generateToken();
    const res = await request(server)
      .delete(`/api/documents/${doc1._id}`)
      .set('x-auth-token', token);

    const docInDb = await Document.findById(doc1._id);
    expect(res.body).toHaveProperty('_id');
    expect(res.status).toBe(200);
    expect(docInDb).not.toBeTruthy();
  }); //test end

  test('that only the author can delete his doc from db', async () => {
    const token = new User().generateToken();
    const res = await request(server)
      .delete(`/api/documents/${doc1._id}`)
      .set('x-auth-token', token);

    expect(res.status).toBe(403);
  }); //test end

  test('that it deletes from db', async () => {
    const token = user1.generateToken();
    const res = await request(server)
      .delete(`/api/documents/${new mongoose.Types.ObjectId()}`)
      .set('x-auth-token', token);

    expect(res.status).toBe(404);
  }); //test end
}); //end of describe
//
//test that if doc dosen't exist on db 404 is returned
