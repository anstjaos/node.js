const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');

// GET /comments/:id
router.get('/:id', (req, res, next) => {
    Comment.find({ commenter: req.params.id }).populate('commenter')
        .then((comments) => {
            res.json(comments);
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

router.patch('/:id', (req, res, next) => {
    Comment.updateOne({ _id: req.params.id }, { comment: req.body.comment })
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

router.delete('/:id', (req, res, next) => {
    Comment.remove({ _id: req.params.id })
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

router.post('/', (req, res, next) => {
    const comment = new Comment({
        commenter: req.body.id,
        comment: req.body.comment,
    });
    comment.save()
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

module.exports = router;
