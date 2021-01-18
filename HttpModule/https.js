const https = require('https');
const fs = require('fs');
const http2 = require('http2');

// lets encrypt 무료 인증서를 발급받았다고 가정.
https.createServer({
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
}, (req, res) => {
    res.end('https server');
}).listen(443);

http2.createSecureServer({
    
}, (req, res) => {
    res.end('http2 server');
}).listen(445);
