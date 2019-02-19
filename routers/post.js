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

//post 
router.get('/allposts',checkAuth, (req, res)=> {
    console.log(req.user.id)
    console.log('getting posts...')
    console.log(req.query.institution)
     const institutions = JSON.parse(req.query.institution)
    console.log(institutions)
     Post.find({institution: { $in: institutions }})
         .sort({date:-1})
         .exec()
         .then(posts=>{
            console.log('got it') 
            console.log(posts)
            res.status(200).json(posts)})
         .catch(err=> {
             res.status(404).json({message:'Something went wrong!'}) })
 })

router.get('/allposts/:postId',checkAuth, (req, res)=> {
  
    Post.findById(req.params.postId)
        .then(post=>res.status(200).json(post))
        .catch(err=> {
            res.status(404).json({message:'Something went wrong!'}) })
})


router.post('/addpostwithImage',upload.single('postImage'),
             checkAuth, 
           async  (req, res)=> {
            const institutions = JSON.parse(req.query.institution)

           console.log('user profile is ', req.user)
              const result = await cloudinary.uploader.upload(req.file.path)  
              console.log(result)        
                 const newPost = new Post({
                name: req.body.name,
                text: req.body.text,
                postImage: result.secure_url,
               profileImage: req.body.profileImage,
                userdata: req.user.id,
                institution:institutions,
               
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


router.post('/addpost', checkAuth, (req, res)=> {
    
    console.log('req.user is',req.user)
    console.log(req.query.institution)
    const institutions = JSON.parse(req.query.institution)
   // console.log( typeof institutions)
     const newPost = new Post({
         name: req.body.name,
         text: req.body.text,
         profileImage:req.body.profileImage,
         userdata: req.user.id,
         institution:institutions
     })
    
     console.log('newpost', newPost)
    newPost.save().then(docs=> res.status(200).json(docs)).catch(err=> res.status(401).json({
        message:'Something went wrong!'
    }))
 })


router.post('/like/:id', checkAuth,
 (req, res)=>{
   
            Post.findById(req.params.id)
                .then(post =>{
                   
                    if(post.likes.filter(like=> like.userdata.toString() === req.user.id)
                        .length > 0)
                    {
                       return res.status(400).json({alreadyliked:'User already liked this post'})
                    }
                    else {
                        post.likes.unshift({
                            userdata: req.user.id,
                            name:req.user.name,
                           profileImage:req.user.profileImage
                        
                        });
                        post.save().then(post =>res.status(200).json(post))
                    }
                   
                   
                })
                .catch((err)=> {
                   console.log(err)
                    res.status(404).json(err)})
        })


router.post('/unlike/:id', checkAuth,
        (req, res)=>{
          
                   Post.findById(req.params.id)
                       .then(post =>{
                          
                           if(post.likes.filter(like=> like.userdata.toString() === req.user.id)
                               .length === 0)
                           {
                              return res.status(400).json({alreadyliked:'You have not liked this post yet'})
                           }
                           else {
                            const removeIndex = post.likes.map(item=> item.userdata.toString()).indexOf(req.user.id)
                            post.likes.splice(removeIndex, 1)
                           post.save().then(post => res.json(post))
                           }
                          
                          
                       })
                       .catch((err)=> {
                          console.log(err)
                           res.status(404).json(err)})
               })

 

router.post('/comment/:id', checkAuth,
        (req, res)=>{
       
           Post.findById(req.params.id).then(post =>{
               const newComment = {
                  text:req.body.text,
                  name: req.user.name,
                  profileImage:req.user.profileImage
               };
               console.log('profile image is ', newComment.profileImage)
               //add comment to array
               post.comments.unshift(newComment)
               //Save comment
               post.save().then(post =>{
                   console.log(post)
                    res.json(post)})
       
           }).catch((err)=> res.status(404).json(err))
       
       })



router.post('/comment/:id/like/:comment_id', checkAuth,
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
                    if(comment.likes.filter(like=> like.userdata== req.user.id).length>0){
                        console.log('already liked')
                    } else {
                        console.log('liking')
                        comment.likes.unshift({
                          
                            userdata:req.user.id,
                            name: req.user.name,
                            profileImage:req.user.profileImage
                        })
                        post.save().then(post => res.json(post))
                        console.log('liked')
                    }
               }
               
            })){
              
           }

        
        })
        .catch((err)=> {
           console.log(err)
            res.status(404).json(err)})
      
      })
    


//add reply to comment
router.post('/comment/:id/reply/:comment_id', checkAuth,
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
                
                   {
                       console.log('replying')
                       comment.comments.unshift({
                         
                           userdata:req.user.id,
                           name: req.user.name,
                           text: req.body.text,
                           profileImage:req.user.profileImage
                       })
                       post.save().then(post => res.json(post))
                       console.log('replied')
                   }
              }
              
           })
           )
           {}

       
       })
       .catch((err)=> {
          console.log(err)
           res.status(404).json(err)})
     
     }) 

router.delete('/comment/:id/:comment_id',  checkAuth,
       (req, res)=> {
        Post.findById(req.params.id).then(post =>{
            console.log('deleting...', req.params.id)
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


router.delete('/deletepost/:id', checkAuth, (req, res)=> {
    Post.findOne({userdata: req.user.id})
    .then(profile =>{
        console.log('deleting..', req.params.id)
        Post.findById(req.params.id)
            .then(post =>{
                
                post.remove().then(() =>{
                    console.log('deleted')
                    res.json({ success: true})})
            })
            .catch((err)=> res.status(404).json(err))
    }).catch(err=> res.status(500).json({message: 'Something went wrong!'}))
})

module.exports = router;