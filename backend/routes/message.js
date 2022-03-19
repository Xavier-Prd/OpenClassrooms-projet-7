const express = require('express');
const router = express.Router();

const messageCtrl = require ('../controllers/message.js');

router.get('/message/:id', messageCtrl.getOne);
router.get('/message', messageCtrl.get);
router.post('/add-message', multer, messageCtrl.add);
router.get('/delete-message/:id', messageCtrl.delete);

module.exports = router;
