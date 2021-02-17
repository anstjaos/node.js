const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
   try {
      const rooms = await Room.find({});
      res.render('main', {
         rooms,
         title: 'GIF 채팅방',
         error: req.flash('roomError')
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.get('/room', (req, res) => {
   res.render('room', { title: 'GIF 채팅방 생성'});
});

router.post('/room', async (req, res, next) => {
   try {
      const newRoom = await Room.create({
         title: req.body.title,
         max: req.body.max,
         owner: req.session.color,
         password: req.body.password,
      });
      const io = req.app.get('io');
      io.of('/room').emit('newRoom', newRoom);
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.get('/room/:id', async(req, res, next) => {
   try {
      const room = await Room.findOne({ _id: req.params.id });
      const io = req.app.get('io');
      if (!room) {
         req.flash('roomError', '존재하지 않는 방입니다.');
         return res.redirect('/');
      }
      if (room.password && room.password !== req.query.password) {
         req.flash('roomError', '비밀번호가 틀렸습니다.');
         return res.redirect('/');
      }
      const { rooms } = io.of('/chat').adapter;
      if (rooms && rooms[req.params.id] && rooms.max <= rooms[req.params.id]) {
         req.flash('roomError', '허용 인원 초과');
         return res.redirect('/');
      }

      return res.render('chat', {
         room,
         title: room.title,
         chats: [],
         user: req.session.color,
      });
   } catch (error) {
      console.error(error);
      next(error);
   }
})
module.exports = router;
