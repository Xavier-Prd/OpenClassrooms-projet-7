const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.js');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user/:id', userCtrl.get);
router.delete('/delete-user/:id', auth, userCtrl.delete);
router.post('/modify-user/:id', auth, multer, userCtrl.edit)

module.exports = router;