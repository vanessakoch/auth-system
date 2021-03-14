const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');
const userController = new UserController();

routes.get('/signin', userController.signin);
routes.post('/signup', userController.signup);
routes.post('/email', userController.show);

module.exports = routes;
