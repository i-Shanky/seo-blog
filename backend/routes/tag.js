const express = require('express')
const router = express.Router()
const {adminMiddleWare, requireSignin} = require('../controllers/auth')
const {create, list, read, remove} = require('../controllers/tag')

const {runValidation} = require('../validators')
const {tagCreateValidator} = require('../validators/tag')

router.post('/tag',tagCreateValidator, runValidation, requireSignin, adminMiddleWare, create);
router.get('/tags',list)
router.get('/tag/:slug',read)
router.delete('/tag/:slug',requireSignin, adminMiddleWare,remove)

module.exports = router;