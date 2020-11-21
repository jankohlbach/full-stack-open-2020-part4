const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('./../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('admin', 10);
  const user = new User({
    username: 'root',
    passwordHash,
  });

  await user.save();
});

test('invalid user is not created', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUserNoUsername = {
    password: 'admin',
  };

  const newUserNoPassword = {
    username: 'jan',
  };

  const newUserShortUsername = {
    username: 'ja',
    password: 'admin',
  };

  const newUserShortPassword = {
    username: 'jan',
    password: 'ad',
  };

  await api
    .post('/api/users')
    .send(newUserNoUsername)
    .expect(400);

  await api
    .post('/api/users')
    .send(newUserNoPassword)
    .expect(400);

  await api
    .post('/api/users')
    .send(newUserShortUsername)
    .expect(400);

  await api
    .post('/api/users')
    .send(newUserShortPassword)
    .expect(400);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test('new user can be added', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'admin',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('content-type', /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const users = usersAtEnd.map(user => user.username);
  expect(users).toContain('testuser');
});

afterAll(() => {
  mongoose.connection.close();
});
