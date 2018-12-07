const express = require('express');
const router = express.Router();
 const User = require('../models/userModel')
 const Profile = require('../models/profileModel')
 const Post = require('../models/postModel')

 const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer')
const Grid = require('gridfs-stream')
require('dotenv').config()
const mongoose = require('mongoose')
const passport = require('passport')
const fs = require('fs')
const FacebookTokenStrategy = require('passport-facebook-token');
const validateProfile = require('../validation/profileError')
const facebookClientId = require('../config/keys').facebookClientId;
const facebookClientSecret = require('../config/keys').facebookClientSecret;

const MongoURI = require('../config/keys').MongoURI;
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// const conn = mongoose.createConnection(MongoURI);
// let gfs;
// conn.once('open', function () {
//      gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('post')
//     // all set!
//   })

// const storage = new GridFsStorage({
//     url: MongoURI,
//     file: (req, file) => {
        
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//         //   let base64 = buf.toString('base64');
//         //   console.log(base64.substr(0,200));
//         //   let image = new Buffer(base64, 'base64');
       
//           const filename = buf.toString('base64') + path.extname(file.originalname);
//           const image = new Buffer(filename, 'base64')
//           const fileInfo = {
//             filename: image,
//             bucketName: 'post'
//           };
          
//           resolve(fileInfo);
//         });
//       });
//     }
//   });
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null,'./uploads/');
    }, filename:(req, file, cb)=> {
        console.log(file)
          const now = new Date().toISOString();
          const date = now.replace(/:/g, '-'); 
          cb(null, date + file.originalname)
       // cb(null, new Date().toISOString()+ file.originalname)
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
        limits: {fileSize: 1024 * 1024 * 3}
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
  }, function(accessToken, refreshToken, profile, done, req, res) {
   
   
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




//update profile image
router.post('/updateProfileImage',
upload.single('profileImage'),
  passport.authenticate('facebook-token'),
  async (req, res, done)=> {
    const result = await cloudinary.uploader.upload(req.file.path)  
    console.log(result) 
    User.findOne({facebookId: req.user.facebookId}).exec()
            .then(users=> {
                if(!users){
                  return res.status(401).json('No user')
                } else {
                    
                    console.log('user profile exists')
                    const user = ({
                       
                        profile: result.secure_url,
                        
                    })
                   User.findOneAndUpdate(
                        { facebookId: req.user.facebookId },
                        { $set : {profile: user.profile}},
                        {new: true},
                    ).then(user=> {
                        console.log('updated user is ',user)
                       return res.status(200).json(user)
                    }).catch(err=> console.log(err))

                    if(result.secure_url){
                        deleteFile(req.file.filename)
                        console.log('deleting')
                    }
                     
                }
            })
            .catch((err)=>res.status(500).json({message:'Something went wrong!Please try agian later.'}))
  }
);

//update profile image in userinfo
router.post('/updateProfileImage2',
upload.single('profileImage'),
  passport.authenticate('facebook-token'),
  async (req, res, done)=> {
    const result = await cloudinary.uploader.upload(req.file.path)  
    console.log(result) 
    Profile.findOne({facebookId: req.user.facebookId}).exec()
            .then(users=> {
                if(!users){
                  return res.status(401).json('No user')
                } else {
                    
                    console.log('user profile exists')
                    const profile = ({
                       
                        profileImage: result.secure_url,
                        
                    })
                   Profile.findOneAndUpdate(
                        { facebookId: req.user.facebookId },
                        { $set : {profileImage: profile.profileImage}},
                        {new: true},
                    ).then(profile=> {
                        console.log('updated profile is ',profile)
                       return res.status(200).json(profile)
                    }).catch(err=> console.log(err))

                    if(result.secure_url){
                        deleteFile(req.file.filename)
                        console.log('deleting')
                    }
                     
                }
            })
            .catch((err)=>res.status(500).json({message:'Something went wrong!Please try agian later.'}))
  }
);



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

router.get('/allposts/:postId',passport.authenticate('facebook-token'), (req, res)=> {
   
    Post.findById(req.params.postId)
        .then(post=>res.status(200).json(post))
        .catch(err=> {
            res.status(404).json({message:'Something went wrong!'}) })
})



router.post('/addpostwithImage',upload.single('postImage'),
             passport.authenticate('facebook-token'), 
           async  (req, res)=> {
           
              const result = await cloudinary.uploader.upload(req.file.path)  
              console.log(result)        
                 const newPost = new Post({
                name: req.user.name,
                text: req.body.text,
                postImage: result.secure_url,
                profileImage: req.user.profile,
                userdata: req.user,
                institution:req.query.institution,
                facebookId:req.user.facebookId
            })
        
    console.log('newpost', newPost)
    await newPost.save().then(docs=>{
       console.log('docs are ', docs)
        res.status(200).json(docs)

    }).catch(err=> res.status(401).json({
       message:'Something went wrong!'
   }))
   if(result.secure_url){
       deleteFile(req.file.filename)
       console.log('deleting')
   }
   setTimeout(()=> cloudinary.uploader.destroy(result.public_id, function(result) { console.log(result) }), 86400000)

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


 router.get('/addpost/image/:imagename',  passport.authenticate('facebook-token'), (req, res)=> {
     
       gfs.files.findOne({filename: req.params.imagename}, (err, file)=> {
           if(!file || file.length == 0){
               return res.status(404).json({
                   err: "No file"
               })
           } else {
              if(file.contentType == 'image/jpeg' || file.contentType == 'image/png' || file.contentType == 'image/jpg'){
                 const readstream = gfs.createReadStream(file.filename);
                  readstream.pipe(res);
                 
              } else {
                  return res.status(404).json({
                      err:'Not an image'
                  })
              }
           }
       })
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
                        post.likes.unshift({
                            facebookId: req.user.facebookId,
                            name:req.user.name,
                            avatar: req.user.profile
                        
                        });
                        post.save().then(post =>res.status(200).json(post))
                    }
                   
                   
                })
                .catch((err)=> {
                   console.log(err)
                    res.status(404).json(err)})
        })

 router.post('/comment/:id', passport.authenticate('facebook-token'),
        (req, res)=>{
       
           Post.findById(req.params.id).then(post =>{
               const newComment = {
                  text:req.body.text,
                  name: req.user.name,
                  avatar:req.user.profile
               };
               //add comment to array
               post.comments.unshift(newComment)
               //Save comment
               post.save().then(post => res.json(post))
       
           }).catch((err)=> res.status(404).json(err))
       
       })

router.post('/comment/:id/like/:comment_id', passport.authenticate('facebook-token'),
       (req, res)=>{
      
        Post.findById(req.params.id)
        .then(post =>{
          console.log(post)
          if(post.comments.filter(comment=> comment._id.toString()== req.params.comment_id).length ==0){
              console.log('no comment')
            return res.status(401).json({nocomment: 'Comment doesnot exist'})
           }

           else if(post.comments.filter(comment=>{ 
               if(comment._id == req.params.comment_id){
                    if(comment.likes.filter(like=> like.facebookId== req.user.facebookId).length>0){
                        console.log('already liked')
                    } else {
                        console.log('liking')
                        comment.likes.unshift({
                            avatar: req.user.profile,
                            facebookId:req.user.facebookId,
                            name: req.user.name,
                        })
                        post.save().then(post => res.json(post))
                        console.log('liked')
                    }
               }
               
            })){
              
           }

        //     else {
        //        console.log('liking')
        //        post.comments.map(comment=>  comment.likes.unshift({
               
        //     })
           
        //     )
           
        //    }
        
        })
        .catch((err)=> {
           console.log(err)
            res.status(404).json(err)})
      
      })


router.delete('/comment/:id/:comment_id',  passport.authenticate('facebook-token'),
       (req, res)=> {
        Post.findById(req.params.id).then(post =>{
       
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id)
             .length === 0)
             {
                return res.status(404).json({nocomment: 'Comment doesnot exist'})
            }
            //get remove index
            const removeIndex = post.comments
                .map(item =>item._id.toString())
                .indexOf(req.params.comment_id)
    
            //delete
            post.comments.splice(removeIndex, 1)
            //Save comment
            post.save().then(post => res.json(post))
    
        }).catch((err)=> res.status(404).json(err))
       }
)

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