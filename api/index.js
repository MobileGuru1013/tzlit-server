'use strict';

const expressJwt = require('express-jwt');
const config = require('../config/');

module.exports = (app) => {
    app.use('/api/*', expressJwt({
        secret: config.jwt.secret
    }).unless({
        path: [
            '/api/login',
            '/api/register'
        ]
    }));

    app.post('/api/register', require('./auth/controller').register);
    app.post('/api/refresh', require('./auth/controller').refreshToken);
    app.post('/api/login', require('./auth/controller').login);
};