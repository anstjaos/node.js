const string = 'abc';
const number = 1;
const boolean = true;
const obj = {
    outside: {
        inside: {
            key: 'value',
        },
    },
};

console.time('전체 시간'); // 인자가 같아야지만 시간을 잰다.
console.log (string, number, boolean);
console.error('에러 메시지');
console.timeEnd('전체 시간');

console.time('시간 측정');
for(let i = 0; i < 100000; i++) {
    continue;
}
console.timeEnd('시간 측정');

console.dir(obj, {colors: true, depth: 2});

function b() {
    console.trace('에러 위치 추적');
}

function a() {
    b();
}

a();