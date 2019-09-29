const { odd, even } = require('./var.js');

function checkOddOrEven(num) {
    if(num & 1) {
        return odd;
    }
    return even;
}

module.exports = checkOddOrEven;