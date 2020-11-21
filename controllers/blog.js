/* globals process */

const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('./../models/blog');
const User = require('./../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if(!request.token || !decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid'});
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id,
  });
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true, runValidators: true, context: 'query'});
  response.json(updatedBlog);
});

module.exports = blogRouter;
