const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const commentCtrl = require ('../controllers/comment.js');

router.get('/comment/:id', commentCtrl.get);
router.post('/add-comment', multer, commentCtrl.add);
router.get('/delete-comment/:id', commentCtrl.delete);

module.exports = router;