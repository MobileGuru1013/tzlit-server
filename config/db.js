'use strict';

const config = require('../config/');
const mysql = require('mysql');

// Connect to DB
const connection = mysql.createConnection(
	{
		host: config.mysql.host,
		user: config.mysql.username,
		password: config.mysql.password,
		database: config.mysql.dbname
	});

connection.connect(
	function(err) {
		if(!err) {
			console.log('Connection to mysql established');
		} else {
			console.log('Error connecting to DB')
		}
	}
);

module.exports = connection;