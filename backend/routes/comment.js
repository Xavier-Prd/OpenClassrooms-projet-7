const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const commentCtrl = require ('../controllers/comment.js');

// router.get('/comment/:id', commentCtrl.get);
router.post('/add-comment', auth, multer, commentCtrl.add);
router.delete('/delete-comment/:id', auth, commentCtrl.delete);

module.exports = router;