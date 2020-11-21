const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('./../models/user');

userRouter.post('/', async (request, response) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash,
  });
  const savedUser = await user.save();
  response.json(savedUser);
});

userRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = userRouter;