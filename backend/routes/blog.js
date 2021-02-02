const express = require('express')
const router = express.Router()
const {create} = require('../controllers/blog')
const {adminMiddleWare, requireSignin} = require('../controllers/auth')
router.post('/blog', requireSignin, adminMiddleWare, create);
module.exports = router;