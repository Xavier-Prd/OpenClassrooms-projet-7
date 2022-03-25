const express = require('express');
const router = express.Router();
const messageCtrl = require ('../controllers/message.js');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.get('/message/:id', messageCtrl.getOne);
router.get('/messages', messageCtrl.get);
router.post('/add-message', auth, multer, messageCtrl.add);
router.post('/modify-message/:id', auth, multer, messageCtrl.edit)
router.delete('/delete-message/:id', auth, messageCtrl.delete);

module.exports = router;
