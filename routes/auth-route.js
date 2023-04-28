const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth-controller');

module.exports = (app) => {
    app.use('/auth', router);
};

router.get('/login', AuthController.login);
router.post('/login', AuthController.login);

