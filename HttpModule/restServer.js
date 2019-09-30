const http = require('http');
const fs = require('fs');

const users = {

};

http.createServer((req, res) => {
    if(req.method === 'GET') {
        if(req.url === '/') {
            return fs.readFile('./restFront.html', (err, data) => {
                if (err) {
                    throw err;
                }
                res.end(data);
            });
        } else if (req.url === '/users') {
            return res.end(JSON.stringify(users));
        }

        return fs.readFile(`.${req.url}`, (err, data) => {
            return res.end(data);
        });
    } else if(req.method === 'POST') {

    } else if (req.method === 'PATCH') {

    } else if (req.method === 'PUT') {

    } else if (req.method === 'DELETE') {

    }
}).listen(8085, () => {
    console.log('8085번 포트에서 서버 대기 중입니다.');
});