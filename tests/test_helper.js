const Blog = require('./../models/blog');
const User = require('./../models/user');

const initialBlogs = [
  {
    title: 'Titel 1',
    author: 'Me',
    url: 'https://jankohlbach.com',
    likes: 101,
  },
  {
    title: 'Titel 2',
    author: 'Jan Kohlbach',
    url: 'https://jankohlbach.com',
    likes: 98,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
