'use strict';

const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const express = require('express');

module.exports = (app) => {
    app.use(compression());
    app.use(bodyParser.urlencoded({
        extended:true,
        limit:1024*1024*80,type:'application/x-www-form-urlencoding'
    }));
    app.use(bodyParser.json({
        limit:1024*1024*80, type:'application/json'
    }));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(morgan('dev'));
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

    return app;
};