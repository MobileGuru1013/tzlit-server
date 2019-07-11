'use strict';

const express = require('express');
const path = require('path');

const config = require('./config');
const app = express();
require('./config/express')(app);
require('./config/auth')(app);
require('./api')(app);

app.use(express.static(path.join(__dirname, 'uploads')));

app.listen(config.port, config.ip, () => {
	console.log(`Server listening on port ${config.port}`);
});

module.exports = app;