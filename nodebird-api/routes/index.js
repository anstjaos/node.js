const express = require('express');

const { User, Domain } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user && req.user.id || null },
            include: { model: Domain },
        });
        res.render('login',{
            user,
            loginError: req.flash('loginError'),
            domains: user && user.Domains,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
