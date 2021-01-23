const express = require('express')
const router = express.Router()
const {authMiddleWare,adminMiddleWare, requireSignin} = require('../controllers/auth')
const {read} = require('../controllers/user')


router.get('/profile',requireSignin, authMiddleWare, read);

module.exports = router;