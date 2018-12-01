const express = require('express');
const router = express.Router();
 const User = require('../models/userModel')
 const Profile = require('../models/profileModel')
 const Post = require('../models/postModel')

const mongoose = require('mongoose')
const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token');
const validateProfile = require('../validation/profileError')
const facebookClientId = require('../config/keys').facebookClientId;
const facebookClientSecret = require('../config/keys').facebookClientSecret;


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

router.get('/testing', (req, res)=> {
    res.json({message:'Success'})
})

passport.use(new FacebookTokenStrategy({
    clientID: facebookClientId,
    clientSecret: facebookClientSecret
  }, function(accessToken, refreshToken, profile, done) {
   console.log(profile)
    User.findOne({facebookId: profile.id}).exec()
            .then(()=> {
                const user= ({
                             name: profile.displayName,
                             facebookId: profile.id,
                             first_name: profile.name.givenName,
                             profile: profile.photos[0].value,
                            _id: mongoose.Types.ObjectId()
                        })
                       
                       return done(null, user)
              
            })
            .catch((err)=>res.status(500).json({message:'Something went wrong!Please try agian later.'}))
  }
));
router.post('/fblogin',
  passport.authenticate('facebook-token'),
   (req, res, done)=> {
       console.log(req.user)
    User.findOne({facebookId: req.user.facebookId}).exec()
            .then(users=> {
                if(!users){
                    const user = new User({
                        name: req.user.name,
                        facebookId: req.user.facebookId,
                        first_name: req.user.first_name,
                        profile: req.user.profile,
                        _id: mongoose.Types.ObjectId()
                    })
                    user.save().then(user=> res.json(user))
                } else {
                    
                    console.log('user already exists')
                    const user = ({
                        name: req.user.name,
                        facebookId: req.user.facebookId,
                        first_name: req.user.first_name,
                        profile: req.user.profile,
                        _id:mongoose.Types.ObjectId()
                    })
                    User.findOneAndUpdate(
                        { facebookId: req.user.facebookId },
                        { $set : {user}},
                        { new: true}
                    ).then(user=> {
                        console.log('updated user is ',user)
                        res.json(user)
                    })

                     
                }
            })
            .catch((err)=>res.status(500).json({message:'Something went wrong!Please try agian later.'}))
  }
);



router.get('/currentUser',
     passport.authenticate('facebook-token'),
      (req, res)=>{
    
    User.findOne({ facebookId: req.user.facebookId })
        
        .exec()
        .then(user =>{
            if(!user){
                return res.status(404).json({message:'No user'})
            }
            res.json(user)
        })
        .catch(err => res.status(404).json({message:'Unauthorized'}))
})

router.get('/test', (req, res)=> {
    res.json({message:'Test'})
})

router.get('/currentProfile',
     passport.authenticate('facebook-token'),
      (req, res)=>{
    
    Profile.findOne({ facebookId: req.user.facebookId })
        
        .exec()
        .then(profile =>{
            if(!profile){
               
                return res.status(404).json({message:'No Profile'})
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json({message:'Unauthorized!'}))
})

router.post('/updateProfile',
     passport.authenticate('facebook-token'),
      (req, res, done)=>{
    
    Profile.findOne({ facebookId: req.user.facebookId })
        
        .exec()
        .then(profile =>{
            if(!profile){
               
                return res.status(404).json({message:'No Profile To Update!'})
            }
           else {
           
            const user_data = ({
                    
                institution: req.body.institution.toLowerCase().trim(),
                status: req.body.status,
                residence: req.body.residence,
                bio: req.body.bio,
                profileImage: req.user.profile,
                facebookId: req.user.facebookId,
                name:req.user.name,
                ig_username:req.body.ig_username,
                userdata: req.user
            })
            
            console.log('User profile is updating!', user_data)
            Profile.findOneAndUpdate(
                {facebookId: req.user.facebookId },
                {$set : 
                  user_data
                },
                {new: true}
            ).then(updatedprofile=> {
               
                res.json(updatedprofile)
            })
            

           }
        })
        .catch(err => res.status(404).json({message:'Opps! Something went wrong.'}))
})


router.post('/createprofile', 
    passport.authenticate('facebook-token'), 
    (req, res, done)=> { 
        const {errors, isValid } = validateProfile(req.body)
       if(!isValid){
           
            return res.status(400).json(errors)
       }
        Profile.findOne({facebookId:req.user.facebookId})
        .then(profile=>{
            if(!profile || profile.length ===0){
                const profile = new Profile({
                    _id: new mongoose.Types.ObjectId(),
                    institution: req.body.institution.toLowerCase().trim(),
                    status: req.body.status,
                    residence: req.body.residence,
                    bio: req.body.bio,
                    name:req.user.name,
                    profileImage: req.user.profile,
                    facebookId: req.user.facebookId,
                    ig_username:req.body.ig_username,
                    userdata: req.user
                  });
                  profile.save().then(result => {
                    
                    res.status(201).json({
                          institution: result.institution,
                          status: result.status,
                          _id: result._id,
                          residence: result.residence,
                          bio: result.bio,
                          profileImage: result.profileImage,
                          name:result.name,
                          facebookId: result.facebookId,
                          ig_username:result.ig_username,
                          userdata: result.userdata,  
                    });
                   
                  })
                  
                  .catch(err => {
                    
                    res.status(500).json({
                      error: err,
                      message:'Something went wrong! we are sorry!'
                    });
                  });
            } else {
                const user_data = ({
                    
                    institution: req.body.institution.toLowerCase().trim(),
                    status: req.body.status,
                    residence: req.body.residence,
                    bio: req.body.bio,
                    name:req.user.name,
                    profileImage:req.user.profile,
                    facebookId: req.user.facebookId,
                    ig_username:req.body.ig_username,
                    userdata: req.user
                })
               
                Profile.findOneAndUpdate(
                    {facebookId: req.user.facebookId },
                    {$set : 
                      user_data
                    },
                    {new: true}
                ).then(updatedprofile=> {
                  
                    res.json(updatedprofile)
                })
                
            }
        })
        .catch(err=> res.status(401).json({message:'Something went wrong!'}))
       
         
            
      
})






router.get('/allusers', (req, res)=> {
    Profile.find()
        .sort({date:-1})
        .exec()
        .then(user=>res.status(200).json(user))
        .catch(err=> {
            res.status(404).json({message:'Something went wrong!'}) })
})



router.get('/allcollegues',passport.authenticate('facebook-token'), (req, res)=> {
   
    Profile.find({institution: req.query.institution})
   
        .sort({date:-1})
       
        .exec()
        .then(user=>res.status(200).json(user))
        .catch(err=> {
            res.status(404).json({message:'Something went wrong!'}) })
})





//Search by name
router.get('/allusers',passport.authenticate('facebook-token'), (req, res)=> {

    let name = req.query.name;
   
    User.findOne({name: name})
        .exec()
        .then(docs=> {
            res.status(200).json(
                docs
            )
        })
        .catch(err=> {
            res.status(404).json({error: 'Profile not found'})
        })
})


router.get('/allusers/:userId',passport.authenticate('facebook-token'), (req, res)=> {
    User.findOne({facebookId: req.params.userId})
        .then(user=> {
            console.log(user)
            Profile.findOne({facebookId:user.facebookId})
                .then(docs=> {
                    console.log('docs are ', docs)
                    
                    res.status(200).json(docs)
                })
                .catch(err=> res.status(404).json({message:'No Profile Found!'}))
        })
        .catch(err=> res.status(404).json({message:'No Profile!!'}))
        
      
})



router.delete('/user', passport.authenticate('facebook-token'), (req, res)=> {
    User.findOneAndDelete({facebookId: req.user.facebookId})
    .then(()=>{
       
        Profile.findOneAndDelete({ facebookId: req.user.facebookId })
        .then(()=> {
            Post.findOneAndDelete({facebookId:req.user.facebookId})
            .then(
                ()=> res.json({ success: 'true' }))
        })
        
    }).catch(err=> res.status(500).json({message: 'Something went wrong!'}))
})


//post 
router.get('/allposts',passport.authenticate('facebook-token'), (req, res)=> {
   
    Post.find({institution:req.query.institution})
        .sort({date:-1})
        .exec()
        .then(posts=>res.status(200).json(posts))
        .catch(err=> {
            res.status(404).json({message:'Something went wrong!'}) })
})

router.post('/addpost', passport.authenticate('facebook-token'), (req, res)=> {
    const newPost = new Post({
        name: req.user.name,
        text: req.body.text,
        profileImage: req.user.profile,
        userdata: req.user,
        institution:req.query.institution,
        facebookId:req.user.facebookId
    })
   
    console.log('newpost', newPost)
   newPost.save().then(docs=> res.status(200).json(docs)).catch(err=> res.status(401).json({
       message:'Something went wrong!'
   }))
})


router.post('/like/:id', passport.authenticate('facebook-token'),
 (req, res)=>{
  
            Post.findById(req.params.id)
                .then(post =>{
                   
                    if(post.likes.filter(like=> like.facebookId.toString() === req.user.facebookId)
                        .length > 0)
                    {
                       return res.status(400).json({alreadyliked:'User already liked this post'})
                    }
                    else {
                        post.likes.unshift({facebookId: req.user.facebookId});
                        post.save().then(post =>res.status(200).json(post))
                    }
                   
                   
                })
                .catch((err)=> {
                   
                    res.status(404).json(err)})
        })



router.delete('/deletepost/:id', passport.authenticate('facebook-token'), (req, res)=> {
    Post.findOne({facebookId: req.user.facebookId})
    .then(profile =>{
        Post.findById(req.params.id)
            .then(post =>{
                
                post.remove().then(() => res.json({success: true}))
            })
            .catch((err)=> res.status(404).json(err))
    }).catch(err=> res.status(500).json({message: 'Something went wrong!'}))
})




module.exports = router;