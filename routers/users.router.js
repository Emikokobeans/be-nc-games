const usersRouter = require('express').Router();

const { getUsers, getUsername } = require('../controllers/controllers');

usersRouter.get('/', getUsers);
usersRouter.route('/:username').get(getUsername);

module.exports = usersRouter;
