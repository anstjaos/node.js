const path = require('path');
console.log(path.dirname(__filename));
console.log(path.extname(__filename));
console.log(path.basename(__filename));

console.log(path.parse(__filename));
console.log(path.format({ root: 'D:\\',
dir: 'D:\\Node.js\\module Exam',
base: 'path.js',
ext: '.js',
name: 'path' 
}));

console.log(path.normalize('C://users\\\\document\\\path.js'));
console.log(path.isAbsolute('C:\\'));
console.log(path.relative('C:\\users\\documents\\path.js', 'C:\\'));

console.log(__dirname);
console.log(path.join(__dirname, '..', '..', '/users', '.', '/document'));

console.log(__dirname);
console.log(path.resolve(__dirname, '..', '..', '/users', '.', '/document'));