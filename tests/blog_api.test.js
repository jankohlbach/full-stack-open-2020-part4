const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('./../app');
const Blog = require('../models/blog');

const api = supertest(app);

let token;

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());

  await Promise.all(promiseArray);

  const response = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'admin',
    });

  token = `Bearer ${response.body.token}`;
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('content-type', /application\/json/);
});

test('there are correct amount of blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

test('new blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog for POST',
    author: 'Dude',
    url: 'https://test.com',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(201)
    .expect('content-type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map(blog => blog.title);
  expect(contents).toContain('Test Blog for POST');
});

test('new blog fails with 401 when not token is provided', async () => {
  const newBlog = {
    title: 'Test Blog for POST',
    author: 'Dude',
    url: 'https://test.com',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401);
});

test('missing like property should default to 0', async () => {
  const newBlog = {
    title: 'Test Blog for POST',
    author: 'Dude',
    url: 'https://test.com',
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog);

  expect(response.body.likes).toBe(0);
});

test('missing title and url properties should resond with 400 Bad Request', async () => {
  const newBlogNoTitle = {
    author: 'Me',
    url: 'https://test.com',
    likes: 23,
  };

  const newBlogNoUrl = {
    author: 'Me',
    url: 'https://test.com',
    likes: 23,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlogNoTitle)
    .expect(400);

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlogNoUrl)
    .expect(400);
});

test('status code 204 when deleting with valid id', async () => {
  const newBlog = {
    title: 'Test Blog for DELETE',
    author: 'Dude',
    url: 'https://test.com',
    likes: 5,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog);

  const blogsAtStart = await helper.blogsInDb();

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .set('Authorization', token)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

  const contents = blogsAtEnd.map(blog => blog.title);
  expect(contents).not.toContain(newBlog.title);
});

test('blog property is successfully updated', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      ...blogToUpdate,
      title: 'Test title',
    })
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

  const contents = blogsAtEnd.map(blog => blog.title);
  expect(contents).toContain('Test title');
});

afterAll(() => {
  mongoose.connection.close();
});
