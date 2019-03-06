
 
// const passport = require('passport')


// module.exports = async (req, res, next) => {
//     try {
       
     
//         const token = await req.query.access_token ;
//         console.log('token in check auth is ',token)
//         const decoded = await jwt.verify(token, process.env.JWT_KEY);
        
//         console.log('token 2 in check auth is = ',decoded)
//         req.user = decoded;
//         next();
//     } catch (error) {
//       return null
//     }
// };


const JwtStrategy =  require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')

const User = mongoose.model('user')
require('dotenv').config()

const jwt = require('jsonwebtoken');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('access_token');
opts.secretOrKey  = process.env.JWT_KEY;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        User.findById(jwt_payload.id)
            .then(user =>{
                if(user){
                  console.log('user=', user)
                    return done(null, user)
                }
                else{
                    return done(null, false)
                }
            })
            .catch(err => console.log(err))
    }))
}