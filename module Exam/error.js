const fs = require('fs');

// setInterval(() => {
//     console.log('시작');
//     fs.unlink('./asdfasdf.js', (err) => {
//         if (err) {
//             console.log(err);
//         }
//     });
//     console.log('끝');
// }, 1000);

// 모든 에러를 처리할 수 있지만
// uncaughtException에 의존하지 말고 근본적인 에러의 원인을 해결해야한다.
// node는 process.on 콜백의 실행을 항상 동작한다고 보장하지 않는다.
process.on('uncaughtException', (err) => {
    console.error('예기치 못한 에러', err);
});

setInterval(() => {
    throw new Error('서버를 고장내주마!');
}, 1000);

setTimeout(() => {
    console.log('실행됩니다');
}, 2000);
