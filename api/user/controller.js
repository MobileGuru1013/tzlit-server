'use strict';

const utils = require('../../lib/utils');
const DB = require('../../config/db');
const config = require('../../config');
const events = require('../event/controller');
const moment = require('moment');
const security = require('../../lib/security');


// profile data
// preferrances

// Add User to the Organization
module.exports.userAdd = (req, res) => {
    const userId = req.params.userId;
    const orgId = req.params.orgId;
    const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');
    const adminRole = config.organizationUserRoles.admin;

    const queryInsertAdminUser = `INSERT INTO organizationUser (organizationId, userId, role, 
        createdAt, modifiedAt) VALUES (?,?,?,?,?)`;
    const queryExistingAdminUser = `SELECT id FROM organizationUser WHERE 
            organizationId = ${orgId} AND userId = ${userId} AND role = ${adminRole}`;

    DB.query(queryExistingUser, (err, rows) => {
        if (err || rows[0]) {
            return utils.errorResponse(res, 404, 'sysERR_ORG_USER_EXISTS');
        }

        DB.query(queryInsertAdminUser, [orgId, userId, adminRole, timeFormat, timeFormat], 
            (err, rows) => {
                if (err) {
                    return utils.errorResponse(res, 404, 'sysERR_CANT_ADD_ADMIN_USER');
                }
                const rowId = rows.insertId;
                return res.status(200).json(rowId).end();
        });
    });
};

// Search User by firstName, lastName, username, email
module.exports.userList = (req, res) => {
    const term = req.params.term;
    const querySearch = `SELECT email, firstName, lastName, username, image FROM user
        WHERE user.firstName LIKE %${term}% OR user.lastName LIKE%${term}% OR 
        user.username LIKE %${term}% OR user.emil LIKE %${term}%`;
    DB.query(querySearch, (err, rows) => {
        if (err || !rows[0]) {
            return utils.errorResponse(res, 404, 'sysERR_CANT_FIND_USER');
        }
        return res.status(200).json(rows).end();
    });
};

// Get User Profile
module.exports.profile = (req, res) => {
    const userId = req.params.userId || req.user.id;
    const querySelect = `SELECT email, firstName, lastName, username, image, preferences
        FROM user WHERE user.id = ` + userId;
    DB.query(querySelect, (err, rows) => {
        if (err || !rows[0]) {
            return utils.errorResponse(res, 404, 'sysERR_CANT_GET_USER');
        }
        return res.status(200).json(rows).end();
    });
};

// Update User Profile
// module.exports.userUpdate = (req, res) => {
//     const userId = req.params.userId;
//     const userData = req.body;
//     const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');
//     var data = [];

//     if(userData.email) data.push('email = "' + userData.email + '"');
//     if(userData.firstName) data.push('firstName = "' + userData.firstName + '"');
//     if(userData.lastName) data.push('lastName = "' + userData.lastName + '"');
//     if(userData.username) data.push('username = "' + userData.username + '"');
//     if(userData.image) data.push('image = "' + userData.image + '"');
//     if(userData.password) {
//         const salt = security.generateSalt();
//         const password = security.encryptPassword(userData.password, salt);

//         data.push('salt = "' + salt + '"');
//         data.push('password = "' + password + '"');
//     }
//     if(userData.status) data.push('status = "' + userData.status + '"');
//     if(userData.preferences) data.push('preferences = "' + userData.preferences + '"');
//     data.push('modifiedAt = "' + timeFormat + '"');

//     const queryStr =
//         `UPDATE user
//         SET ` + data.join(', ') + `
//         WHERE user.id = ` + userId;
//     DB.query(queryStr, (err, rows) => {
//         if (err) {
//             return utils.errorResponse(res, 404, 'sysERR_CANT_UPDATE_USER');
//         }
//         return res.status(200).json({"Status":"OK", "StatusMsg":"User Profile Updated"}).end();
//     });
// };