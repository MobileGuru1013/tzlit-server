'use strict';

const passport = require('passport');
const utils = require('../../lib/utils');
const security = require('../../lib/security');
const DB = require('../../config/db');
const config = require('../../config');
const moment = require('moment');

exports.refreshToken = function(req, res) {
    DB.query("SELECT * FROM user WHERE id = ? ", [req.user.id], function(err, user) {
        if (!user) {
            return utils.errorResponse(res, 404, 'sysERR_USER_NOT_FOUND');
        }
        //user = user.getData();
        let token = utils.createJwtToken(user[0]);

        return res.json({
            token: token
        });
    });
};

exports.register = function(req, res) {
    const user = req.body;
    const salt = security.generateSalt();
    const password = security.encryptPassword(user.password, salt);
    user.password = password;
    user.salt = salt;


    // delete user.verification;
    DB.query("SELECT * FROM user WHERE email = ?", [user.email], function(err, regUser) {
        if (err) {
            return utils.errorResponse(res, 500, 'sysERR_CANT_CREATE_USER');
        }

        if (regUser[0]) {
            return utils.errorResponse(res, 400, 'sysERR_EMAIL_IS_IN_USE');
        }

        const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');
        const insertQuery = `INSERT INTO user ( email, password, salt, status, 
            createdAt, modifiedAt) values (?,?,?,?,?,?)`;

        DB.query(insertQuery, [user.email, user.password, user.salt, 1,  timeFormat, timeFormat], (err, rows) => {
            if (err) {
                return utils.errorResponse(res, 500, 'sysERR_CANT_CREATE_USER');
            }
            user.userId = rows.insertId;
            res.status(200).json(user);
        });
    });
};

const authenticate = function(req, res, next) {
    passport.authenticate('login', function(err, user) {
        if (err) {
            return res.status(404).json('User not found');
        }

        console.log(user);

        return res.status(200).json({
            token: utils.createJwtToken(user),
            user: req.user
        });
    })(req, res, next);
};

exports.login = function(req, res, next) {
    return authenticate(req, res, next);
};
