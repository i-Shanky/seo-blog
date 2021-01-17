const User = require('../models/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
exports.signup = (req,res) => {
    User.findOne({email: req.body.email}).exec((err, user)=> {
        if(user){
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

        const {name, email, password} = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        let newUser = new User({name, email, password, profile, username})
        newUser.save((error,success)=> {
            if(error) {
                return res.status(400).json({
                    error: err
                })
            }
            return res.json({
               message: "Signup successful!"
            })
        })
    })
}


exports.signin = (req,res) => {
    //check if user exists
    const {email, password} = req.body
    User.findOne({email}).exec((err,user)=> {
        if(err || !user)
            return res.status(400).json({
                error: 'User with email doesnot exist! please signup'
            });
        //validate password
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password donot match'
            });
        }
        //generate json web token if successful 
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn: '1d'});
        res.cookie('token',token, {expiresIn: '1d'})

        const {_id,username, name, email, role} = user;
        
        res.status(200).json({
            token,
            user: {_id,username, name, email, role}
        });
    })

}

exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
        message: 'Signout successful'
    });
};
//Check for token expiry using expressJwt
exports.requireSignin =  expressJwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET
})