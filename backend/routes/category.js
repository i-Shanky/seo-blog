const express = require('express')
const router = express.Router()
const {adminMiddleWare, requireSignin} = require('../controllers/auth')
const {create, list, read, remove} = require('../controllers/category')

const {runValidation} = require('../validators')
const {categoryCreateValidator} = require('../validators/category')

router.post('/category',categoryCreateValidator, runValidation, requireSignin, adminMiddleWare, create);
router.get('/categories',list)
router.get('/category/:slug',read)
router.delete('/category/:slug',requireSignin, adminMiddleWare,remove)

module.exports = router;