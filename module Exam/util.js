const util = require('util');
const crypto = require('crypto');

// 지원이 조만간 중단될 메서드임을 알려준다.
const dontuseme = util.deprecate((x, y) => {
    console.log(x + y);
}, '이 함수는 곧 지원하지 않습니다.');

dontuseme(1, 2);

const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt', salt);
    crypto.pbkdf2('anstjaos바보', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password', key.toString('base64'));
    });
});

randomBytesPromise(64)
    .then((buf) => {
        const salt = buf.toString('base64');
        return pbkdf2Promise('anstjaos바보', salt, 100000, 64, 'sha512');
    })
    .then((key) => {
        console.log('password', key.toString('base64'));
    })
    .catch((err) => {
        console.err(err);
    });

(async () => {
    const buf = await randomBytesPromise(64);
    const salt = buf.toString('base64');
    const key = await pbkdf2Promise('anstjaos바보', salt, 100000, 64, 'sha512');
    console.log('password', key.toString('base64'));
})();
