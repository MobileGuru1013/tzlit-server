'use strict';

module.exports = {
    jwt: {
        expires: 3600,
        tokenLiveTime: 24 * 60 * 60,
        secret: 'SNSkkcTTibRl5Csu7DpArEfCZ5zIa6pU59gjEN9T8Wk7T5ud1QrTjfQ1VLRPH'
    },
    ip: process.env.IP,
    port: process.env.PORT || 3400,
    mysql: {
        host: 'us-cdbr-iron-east-03.cleardb.net',
        username: 'b595ca102d960a',
        password: '75db5f39',
        dbname: 'heroku_e42f2073c9a01fa'
    }
};