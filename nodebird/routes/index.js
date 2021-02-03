const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
   res.render('profile', { title: '내 정보 - nodebird', user: null });
});

router.get('/join', isNotLoggedIn, (req, res) => {
   res.render('join', {
       title: '회원가입 - nodebird',
       user: req.user,
       joinError: req.flash('joinError'),
   });
});

router.get('/', (req, res, next) => {
    Post.findAll({
        include: {
            model: User,
            attributes: ['id', 'nick'],
        },
    })
        .then((posts) => {
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

module.exports = router;
