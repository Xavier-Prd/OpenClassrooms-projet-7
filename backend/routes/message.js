const express = require('express');
const router = express.Router();
const messageCtrl = require ('../controllers/message.js');
const multer = require('../middleware/multer-config');

router.get('/message/:id', messageCtrl.getOne);
router.get('/messages', messageCtrl.get);
router.post('/add-message', multer, messageCtrl.add);
router.get('/delete-message/:id', messageCtrl.delete);

module.exports = router;
