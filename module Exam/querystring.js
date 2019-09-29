const url = require('url');
const querystring = require('querystring');

const parsedUrl = url.parse('http://github.com/anstjaos?page=3&limit=10');
const query = querystring.parse(parsedUrl.query);

console.log('querystring.parse(): ', query);
console.log('querystring.stringify(): ', querystring.stringify(query));