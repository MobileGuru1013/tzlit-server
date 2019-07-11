'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

exports.createJwtToken = (user) => {
    let expires = config.jwt.customerTokenLiveTime;
    return jwt.sign(user, config.jwt.secret, {
        expiresIn: expires
    });
};

exports.errorResponse = (res, status, message) => {
    return res.status(status).json({
        messages: [{
            text: message,
            severity: 'error'
        }]
    });
};

const uploadImage = (img, name, entityType) => {
    const imagePath = path.join(process.cwd(), `/uploads/${entityType}s/`, name);
    const buf = new Buffer(img, 'base64');
    fs.writeFile(imagePath, buf);
};

exports.parseInsertFields = (data, entityType, mode = 'create') => {
    //let fieldNames = [];
    let fields = {};

    for(let i = 0; i< data.length; i++) {
        if(data[i][1] !== 'null' && data[i][1]) {
            //fieldNames.push(data[i][0]);
            if(data[i][0] == 'image') {
                const imageData = JSON.parse(data[i][1]);
                //fieldValues.push(imageName);
                if(imageData.uri && imageData.name) {
                    const imageName = (imageData.name).toLowerCase();
                    fields[data[i][0]] = imageName;
                    uploadImage(imageData.uri, imageName, entityType);
                }
            } else {
               fields[data[i][0]] = data[i][1];
            }
        }
    }

    const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');
    if(mode === 'create') {
        fields.createdAt = timeFormat;
    }
    fields.modifiedAt = timeFormat;
    //fieldValues.push(timeFormat, timeFormat);

    return {fields};
};
