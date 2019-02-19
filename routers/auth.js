const express = require('express');
const router = express.Router();
 const User = require('../models/userModel')
 const Profile = require('../models/profileModel')
 const Post = require('../models/postModel')

 const checkAuth = require('../middleware/check-auth');
 const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require('passport')

const multer = require('multer')
require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const validateProfile = require('../validation/profileError')
const validateRegister = require('../validation/registerError')
const validateLogin = require('../validation/LoginError')



const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null,'./uploads/');
    }, filename:(req, file, cb)=> {
        console.log(file)
          const now = new Date().toISOString();
          const date = now.replace(/:/g, '-'); 
          cb(null, date + file.originalname)
    }
}
)

const upload = multer({ 
        storage: storage ,
        //dest:'uploads/',
        fileFilter: (req, file, cb)=> {
            console.log(file)
            if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
                cb(null, true)
               
            } else {
                cb(new Error('file not supported'), false)
            }
        },  
        
})
//const upload = multer({dest: 'uploads/'})

const deleteFile = (file) => {
    fs.unlink('./uploads/'+ file, function(err) {
        if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`removed`);
        }})
}


router.get('/testing', (req, res)=> {
    console.log(req.query)
    res.json({message:'Success'})
})

// passport.use(new FacebookTokenStrategy({
//     clientID: facebookClientId,
//     clientSecret: facebookClientSecret
//   }, function(accessToken, refreshToken, profile, done, req, res) {
   
  
//         User.findOne({facebookId: profile.id}).exec()
//         .then(()=> {
//             const user= ({
//                          name: profile.displayName,
//                          facebookId: profile.id,
//                          first_name: profile.name.givenName,
//                          profile: profile.photos[0].value,
//                         _id: mongoose.Types.ObjectId()
//                     })
                   
//                    return done(null, user)
          
//         })
//         .catch((err)=>res.status(500).json({message:'Something went wrong!Please try agian later.'}))
    
  
  
//   }
// ));
// router.post('/fblogin',
//   passport.authenticate('facebook-token'),
//    (req, res, done)=> {
//        console.log(req.user)
//     User.findOne({facebookId: req.user.facebookId}).exec()
//             .then(users=> {
//                 if(!users){
//                     const user = new User({
//                         name: req.user.name,
//                         facebookId: req.user.facebookId,
//                         first_name: req.user.first_name,
//                         profile: req.user.profile,
//                         _id: mongoose.Types.ObjectId()
//                     })
//                     user.save().then(user=> res.json(user))
//                 } else {
                    
//                     console.log('user already exists')
//                     const user = ({
//                         name: req.user.name,
//                         facebookId: req.user.facebookId,
//                         first_name: req.user.first_name,
//                         profile: req.user.profile,
//                         _id:mongoose.Types.ObjectId()
//                     })
//                     User.findOneAndUpdate(
//                         { facebookId: req.user.facebookId },
//                         { $set : {user}},
//                         { new: true}
//                     ).then(user=> {
//                         console.log('updated user is ',user)
//                         res.json(user)
//                     })

                     
//                 }
//             })
//             .catch((err)=>res.status(500).json({message:'Something went wrong!Please try agian later.'}))
//   }
// );



// router.get('/currentUser',
//      passport.authenticate('facebook-token'),
//       (req, res)=>{
    
//     User.findOne({ facebookId: req.user.facebookId })
        
//         .exec()
//         .then(user =>{
//             if(!user){
//                 return res.status(404).json({message:'No user'})
//             }
//             res.json(user)
//         })
//         .catch(err => res.status(404).json({message:'Unauthorized'}))
// })
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id)
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
     
      if(!err) done(null, user);
      else done(err, null)  
  })
});

router.get('/test', (req, res)=> {
    res.json({message:'Test'})
})


//Login and Signup
router.post("/signup", async(req, res, next) => {
    const {errors, isValid } = validateRegister(req.body)
    if(!isValid){
        
         return res.status(400).json(errors)
    }
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
            console.log(user)
            errors.email = 'Looks like you are already registered. Please go back and login to continue';
           return res.status(401).json(errors)

            
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            }
             else {
              const user = new User({
               _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                name: req.body.name,
                profileImage:'',
                first_name : req.body.name.split(" ")[0],
               
              });
              user
                .save()
                .then(result => {
                   
                    console.log('result is ',result)
                    const payload = {
                        email: result.email,
                        id: result._id,
                        name: result.name,
                       profileImage:'',
                        first_name: result.first_name,
                       

                    }
                    console.log('payload is',payload)
                    //sign token
                    jwt.sign(
                     payload ,
                     process.env.JWT_KEY,
                    
                     (err, token)=>{
                         res.json({
                             success: true,
                             token:  token
                         })
                     }
                 );

                  
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
  });
  

  router.post("/login", (req, res, next) => {

    const {errors, isValid } = validateLogin(req.body)
    if(!isValid){
        
         return res.status(400).json(errors)
    }

    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
           
                errors.email = 'Email not found! Please go back and register.'
                return res.status(404).json(errors) 
            
        }
        bcrypt.compare(req.body.password, user[0].password
          ).then(
              isMatched=> {
                if (isMatched) {
                    
                  const payload = {
                     profileImage:user[0].profileImage,
                      email: user[0].email,
                      id: user[0].id,
                        name: user[0].name,
                        first_name: user[0].first_name,
                  }
                  console.log('payload is ',payload)
                  //sign token
                  jwt.sign(
                   payload ,
                   process.env.JWT_KEY,
                  (err, token)=>{
                       res.json({
                           success: true,
                           token:  token
                       })
                   }
               );
              }
              else{
                errors.password= 'Email and password pair is incorrect'
                return res.status(400).json(errors)
            }
              }
           
          ).catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
  router.get('/current',
  checkAuth,
     (req, res)=>{
         console.log(req.query.access_token)
         res.json({
            
            
             id: req.user.id,
             name: req.user.name,
             email: req.user.email
           
         })
     }
)



router.delete('/user',checkAuth, (req, res)=> {
    User.findOneAndDelete({_id: req.user.id})
    .then(()=>{
       
        Profile.findOneAndDelete({ userdata: req.user.id })
        .then(()=> {
            Post.findOneAndDelete({userdata:req.user.id})
            .then(
                ()=> res.json({ success: 'true' }))
        })
        
    }).catch(err=> res.status(500).json({message: 'Something went wrong!'}))
})
















module.exports = router;