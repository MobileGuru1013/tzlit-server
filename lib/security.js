"use strict";
const assert = require('assert');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const pbkdfOptions = {
    iterations: 5,
    keylength: 20,
    algorithm: 'sha1'
};

/**
 * Encrypt the given password
 *
 * @param  {String} password Password
 * @param  {String} salt     Salt
 * @return {String}          Encrypted passport
 */
exports.encryptPassword = (password, salt) => {
    return crypto.pbkdf2Sync(
        password,
        salt,
        pbkdfOptions.iterations,
        pbkdfOptions.keylength,
        pbkdfOptions.algorithm
    ).toString('hex');
};

/**
 * Generate salt
 *
 * @return {String} Salt
 */
exports.generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

/**
 * Given user if authenticated
 *
 * @param  {token} token     token
 * @return {object}          user
 */
exports.getUser = (token, callback) => {
    assert(token);
    assert(callback);
    assert('function' === typeof callback);
    jwt.verify(token, config.jwt.secret, {}, callback);
};
