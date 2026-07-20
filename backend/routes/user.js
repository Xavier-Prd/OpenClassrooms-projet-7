const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.js');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const rateLimit = require('../middleware/rate-limit');

router.post('/signup', rateLimit, userCtrl.signup);
router.post('/login', rateLimit, userCtrl.login);
router.get('/user/:id', auth, userCtrl.get);
router.delete('/delete-user/:id', auth, userCtrl.delete);
router.post('/modify-user/:id', auth, multer, userCtrl.edit)

module.exports = router;