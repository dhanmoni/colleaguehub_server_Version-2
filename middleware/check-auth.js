
 require('dotenv').config()

const jwt = require('jsonwebtoken');
const passport = require('passport')


module.exports = async (req, res, next) => {
    try {
       
     
        const token = await req.query.access_token ;
        console.log('token in check auth is ',token)
        const decoded = await jwt.verify(token, process.env.JWT_KEY);
        
        console.log('token 2 in check auth is = ',decoded)
        req.user = decoded;
        next();
    } catch (error) {
      return null
    }
};