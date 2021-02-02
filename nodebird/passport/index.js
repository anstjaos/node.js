const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const { User } = require('../models');

module.exports = () => {
    // 유저 정보 중 아이디만 세션에 저장
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    // kakao(passport);
};
