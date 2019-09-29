const url = require('url');

const URL = url.URL;
const myURL = new URL('http://github.com/anstjaos');

console.log('new URL():', myURL);
console.log('url.format(): ', url.format(myURL));
console.log('------------------');

const parsedUrl = url.parse('https://github.com/anstjaos');
console.log('url.parse(): ', parsedUrl);