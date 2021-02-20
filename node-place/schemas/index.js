const mongoose = require('mongoose');
const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;

const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`

module.exports = () => {
    const connect = () => {
        if (NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.connect(MONGO_URL, {
            dbName: 'mongoplace',
        }, (error) => {
            if (error) {
                console.error('몽고 디비 연결 에러', error);
            } else {
                console.log('몽고 디비 연결 성공');
            }
        });
    };

    connect();

    mongoose.connect.on('error', (error) => {
        console.error('몽고디비 연결 에러', error);
    });
    mongoose.connect.on('disconnected', () => {
        console.error('몽고 디비 연결이 끊겼습니다. 재접속을 시도합니다.');
        connect();
    })
    require('./favorite');
    require('./history');
};
