const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const { Good, Auction, User, sequelize } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', async (req, res, next) => {
    try {
        const goods = await Good.findAll({ where: { soldId: null } });
        res.render('main', {
            title: 'NodeAuction',
            goods,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction',
    });
});

router.get('/good', isLoggedIn, (req, res) => {
    res.render('good', { title: '상품 등록 - NodeAuction' });
});

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/good', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { name, price } = req.body;
        const good = await Good.create({
            ownerId: req.user.id,
            name,
            end: req.body.end,
            img: req.file.filename,
            price,
        });
        const end = new Date();
        end.setHours(end.getHours() + good.end);
        // 서버 메모리에 스케쥴이 저장됨.
        // 서버가 재시작할 경우 다 사라짐.
        schedule.scheduleJob(end, async () => {
            const success = await Auction.findOne({
                where: { goodId: good.id },
                order: [['bid', 'DESC']],
            });

            if (success) {
                await Good.update({soldId: success.userId}, {where: {id: good.id}});
                await User.update({
                    money: sequelize.literal(`money - ${success.bid}`),
                }, {
                    where: {id: success.userId},
                });
            } else {
                await Good.update({ soldId: good.ownerId }, { where: { id: good.id }});
            }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/good/:id', isLoggedIn, async (req, res, next) => {
   try {
       const [good, auction] = await Promise.all([
           Good.findOne({
               where: { id: req.params.id },
               include: {
                   model: User,
                   as: 'owner',
               },
           }),
           Auction.findAll({
               where: { goodId: req.params.id },
               include: { model: User },
               order: [['bid', 'ASC']],
           }),
       ]);
       res.render('auction', {
           title: `${good.name} - NodeAuction`,
           good,
           auction
       });
   } catch (error) {
       console.error(error);
       next(error);
   }
});

router.post('/good/:id/bid', isLoggedIn, async (req, res, next) => {
   try {
       const { bid, msg } = req.body;
       const good = await Good.findOne({
           where: { id: req.params.id },
           include: { model: Auction },
           order: [[{ model: Auction}, 'bid', 'DESC']],
       });

       if (good.ownerId === req.user.id) {
           return res.status(403).send('상품 주인은 경매에 참여할 수 없습니다.');
       }
       if (good.price > bid) {
           return res.status(403).send('시작 가격보다 높게 입찰해야 합니다.');
       }

       if (new Date(good.createdAt).valueOf() + (24 * 60 * 60 * 1000) < new Date()) {
           return res.status(403).send('경매가 이미 종료되었습니다.');
       }

       if (good.auctions[0] && good.auctions[0].bid >= bid) {
           return res.status(403).send('이전 입찰가보다 높아야 합니다.');
       }

       const result = await Auction.create({
           bid,
           msg,
           userId: req.user.id,
           goodId: req.params.id,
       });
       req.app.get('io').to(req.params.id).emit('bid', {
           bid: result.bid,
           msg: result.msg,
           nick: req.user.nick,
       });
       return res.send('ok');
   } catch (error) {
       console.error(error);
       next(error);
   }
});

module.exports = router;
