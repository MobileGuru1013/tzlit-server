'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DB = require('./db');
const config = require('./index');
const security = require('../lib/security');

const authFields = {
    emailField: 'email',
    passwordField: 'password'
};

const authHandler = function(err, rows, password, done) {
    if (err) return done(true);
    if (!rows.length) {
        return done(true);
    }
    let passwordHash = security.encryptPassword(password, rows[0].salt);
    if (passwordHash !== rows[0].password) {
        return done(true);
    }
    delete rows[0].password;
    //let userData = user.getData(user);
    return done(null, rows[0]);
};

passport.use('login', new LocalStrategy({ emailField: 'email', passwordField: 'password' },
    function(email, password, done) {
         DB.query("SELECT * FROM user WHERE email = ? AND status = ?", [email, config.statuses.user.active], 
            function(err, rows) {
            authHandler(err, rows, password, done);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.userId);
});

passport.deserializeUser(function(userId, done) {
    DB.query("SELECT * FROM user WHERE id = ? ", [userId], function(err, user) {
        done(err, user[0]);
    });
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    return passport;
};

