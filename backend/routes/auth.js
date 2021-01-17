const express = require('express')
const router = express.Router()
const {signup, signin, signout, requireSignin} = require('../controllers/auth')
const {runValidation} = require('../validators')
const {userSignupValidator,userSigninValidator} = require('../validators/auth')

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout',signout)
//test authentication
router.get('/secret', requireSignin, (req,res)=> {
    res.json({
        message: 'You have access to secret path'
    })
})
module.exports = router;