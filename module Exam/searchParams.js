const {URL} = require('url');

const myURL = new URL('https://github.com/?page=3&limit=10&category=nodejs&category=javascript');
console.log('searchParams: ', myURL.searchParms);

console.log('searchParams.getAll(): ', myURL.searchParams.getAll('category'));
console.log('searchParams.get(): ', myURL.searchParams.get('limit'));

console.log('searchParams.keys(): ', myURL.searchParams.keys());
console.log('searchParams.values(): ', myURL.searchParams.values());

myURL.searchParams.append('filter', 'es3');
console.log(myURL.searchParams.getAll('filter'));

console.log('searchParams.toString()', myURL.searchParams.toString());