const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');
const userController = new UserController();

routes.get('/', userController.index);
routes.post('/signin', userController.signin);
routes.post('/signup', userController.signup);
routes.get('/list', userController.verifyAuth, userController.list);

module.exports = routes;
