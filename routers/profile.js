const express = require('express');
const router = express.Router();
 const User = require('../models/userModel')
 const Profile = require('../models/profileModel')
 const Group = require('../models/groupModel')

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


router.get('/currentProfile',
 passport.authenticate('jwt', {session: false}),
      (req, res)=>{
    
    Profile.findOne({ userdata: req.user.id })
        
        .exec()
        .then(profile =>{
            console.log('profile ', profile)
            if(!profile){
               
                return res.status(404).json({message:'No Profile'})
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json({message:'Unauthorized!'}))
})







router.post('/createProfile',  passport.authenticate('jwt', {session: false}), (req, res)=> {


    const profileFields = {};
    profileFields.userdata = req.user.id;
    profileFields.name = req.user.name;
    profileFields.pro = false;
    if(req.body.residence) profileFields.residence = req.body.residence;

    profileFields.social = {}
    profileFields.social.email= req.user.email;
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube ||'';
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter ||'';
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram ||'';
   
 Profile.findOne({userdata: req.user.id})
        .exec()
        .then(profile=> {
            console.log(profile)
           if(!profile) {
                console.log('creating')
                new Profile(profileFields).save().then(profile=> {
                    console.log('profile is ',profile)
                    res.json(profile)
                })
           }
           else {
            
            Profile.findOneAndUpdate( 
                {userdata: req.user.id },
                {$set : 
                  profileFields
                },
                {new: true}).then(profile=> {
                    console.log('updated ', profile)
                    res.json(profile)
                }).then(profile=> res.json(profile))
           }
        }).catch({

        })
})



router.post('/updateProfile/institution/public',  passport.authenticate('jwt', {session: false}), (req, res)=>{


    // const {errors, isValid } = validateProfile(req.body)
    // if(!isValid){
        
    //      return res.status(400).json(errors)
    // }

    Profile.findOne({ userdata: req.user.id })
        .then(profile => {
            console.log('it is here1')
            

            if(profile.institution.filter(institution=> institution.institution_name == req.body.public_institution_name)
                               .length >=1)
                           {
                               return res.status(400).json({notstared:'Duplicate institution name'})
                           }

            //console.log(profile.institution)
           const newIns = {
               institution_name: req.body.public_institution_name,
               description: req.body.public_description,
               private: false
           }
           console.log(profile)
           profile.institution.push(newIns)
           if(profile.activeGroup.filter(institution=> institution.institution_name == req.body.public_institution_name)
           .length >=1)
                {
                    return res.status(400).json({notstared:'Duplicate institution name'})
                }
           profile.activeGroup.push(newIns)
           profile.save()
               .then(profile => {
                console.log('profile = ',profile)
               
                res.json(profile)})
               .catch(err=> console.log(err))
               Group.findOne({institution_name: newIns.institution_name}).then(group=> {
               
                if(!group){
                    const newGroup= {
                        createdBy: req.user.name,
                        institution_name: newIns.institution_name,
                        
                        private: newIns.private
                    
                    }
                    new Group(newGroup).save().then((pro)=> console.log(pro))
                       
                } else {
                    console.log('ok')
                    return null
                }
            
                     
                    })
         
        })
})


router.post('/createProfile/institution/public',  passport.authenticate('jwt', {session: false}), (req, res)=>{


    // const {errors, isValid } = validateProfile(req.body)
    // if(!isValid){
        
    //      return res.status(400).json(errors)
    // }

    Profile.findOne({ userdata: req.user.id })
        .then(profile => {
            console.log('it is here1')
            

            if(profile.institution.filter(institution=> institution.institution_name == req.body.institution_name)
                               .length >=1)
                           {
                               return res.status(400).json({notstared:'Duplicate institution name'})
                           }

            //console.log(profile.institution)
           const newIns = {
               institution_name: req.body.institution_name,
               description: req.body.description,
               private: false
           }
           console.log(profile)
           profile.institution.push(newIns)
           if(profile.activeGroup.filter(institution=> institution.institution_name == req.body.institution_name)
           .length >=1)
                {
                    return res.status(400).json({notstared:'Duplicate institution name'})
                }
           profile.activeGroup.push(newIns)
           profile.save()
               .then(profile => {
                console.log('profile = ',profile)
               
                res.json(profile)})
               .catch(err=> console.log(err))
               Group.findOne({institution_name: newIns.institution_name}).then(group=> {
               
                if(!group){
                    const newGroup= {
                        createdBy: req.user.name,
                        institution_name: newIns.institution_name,
                        
                        private: newIns.private
                    
                    }
                    new Group(newGroup).save().then((pro)=> console.log(pro))
                       
                } else {
                    console.log('ok')
                    return null
                }
            
                     
                    })
         
        })
})



router.post('/createProfile/updateActiveGroup',  passport.authenticate('jwt', {session: false}), (req, res)=> {
    console.log('ins =',req.body.myActiveGroups)
    const institutions = JSON.parse(req.body.myActiveGroups)
    console.log('ins2 =',institutions)
    
    Profile.findOne({userdata:req.user.id})
        .then(profile=> {
            if(profile.activeGroup.filter(institution=> institution.institution_name == req.body.institution_name)
                    .length >=1)
                {
                    return res.status(400).json({notstared:'Duplicate institution name'})
                }
           
            Profile.findOneAndUpdate( 
                {userdata: req.user.id },
                {$set : 
                  {activeGroup: institutions}
                },
                {new: true}).then(profile=> {
                    console.log('updated ', profile)
                    res.json(profile)
                }).then(profile=> res.json(profile)).catch(err=> console.log(err))
        })
})
   

router.post('/createProfile/institution/private',  passport.authenticate('jwt', {session: false}), (req, res)=>{

    // const {errors, isValid } = validateProfile(req.body)
    // if(!isValid){
        
    //      return res.status(400).json(errors)
    // }
    
    Profile.findOne({ userdata: req.user.id })
        .then(profile => {

                if(profile.institution.filter(institution=> institution.institution_name == req.body.private_institution_name)
                    .length >=1)
                {
                    return res.status(400).json({notstared:'Duplicate institution name'})
                }
            const newIns = {
                institution_name: req.body.private_institution_name,
                description: req.body.private_description,
                private: true,
                secret_code: req.body.password
            }
           
           profile.institution.push(newIns)
           if(profile.activeGroup.filter(institution=> institution.institution_name == req.body.private_institution_name)
           .length >=1)
                {
                    return res.status(400).json({notstared:'Duplicate institution name'})
                }
           profile.activeGroup.push(newIns)
           profile.save().then(profile => {
               console.log(profile)
               res.json(profile)})
         Group.findOne({institution_name: newIns.institution_name}).then(group=> {

            if(!group){
                const newGroup= {
                    createdBy: req.user.name,
                    institution_name: newIns.institution_name,
                    secret_code: newIns.secret_code,
                    private: newIns.private
                
                }
                new Group(newGroup).save().then((pro)=> console.log(pro))
                   
            } else {
                console.log('ok')
                return null
            }
        
                 
                })
        })
})

router.post('/createProfile/skills',  passport.authenticate('jwt', {session: false}), (req, res)=>{

    
    Profile.findOne({ userdata: req.user.id })
        .then(profile => {
           const newSkill = {
               title: req.body.title,
               }
           //add experience to array
           profile.skills.push(newSkill)
           profile.save().then(profile => {
               console.log(profile)
               res.json(profile)})
        })
})

router.delete('/createProfile/skills/:id',  passport.authenticate('jwt', {session: false}), (req, res)=> {
    Profile.findOne({userdata: req.user.id})
               
    .then(profile =>{
      
       console.log(req.params.id)
        if(profile.skills.filter(skill=> skill._id.toString() === req.params.id)
            .length <1)
        {
            console.log('hi2')
            return res.status(400).json({notstared:'No skill'})
        }
       const removeIndex = profile.skills.map(item=> item._id.toString()).indexOf(req.params.id)
        profile.skills.splice(removeIndex, 1)
       profile.save().then(profile =>{
      
         res.json(profile)})
       
    })
    .catch((err)=> res.status(404).json(err))
})

router.post('/createProfile/bio',  passport.authenticate('jwt', {session: false}), (req, res)=>{

    
    Profile.findOne({ userdata: req.user.id })
        .then(profile => {
           const bio = {
               bio: req.body.bio
           }
           
           Profile.findOneAndUpdate( 
            {userdata: req.user.id },
            {$set : 
              {bio: bio.bio}
            },
            {new: true}).then(profile=> {
               
                res.json(profile)
            }).then(profile=> res.json(profile))
        })
})

//update name
router.post('/updateProfile/name',  passport.authenticate('jwt', {session: false}), (req, res)=>{

    
    User.findOne({ _id: req.user.id })
        .then(profile => {
           
           User.findOneAndUpdate( 
            {_id: req.user.id },
            {$set : 
              {name: req.body.name}
            },
            {new: true}).then(profile=> {
               console.log('req.user is=', req.user)
                res.json(profile)
            }).then(profile=> res.json(profile))
        })
})
//in profile
router.post('/updateProfile/name2',  passport.authenticate('jwt', {session: false}), (req, res)=>{

    
    Profile.findOne({ userdata: req.user.id })
        .then(profile => {
           
           Profile.findOneAndUpdate( 
            {userdata: req.user.id },
            {$set : 
              {name: req.body.name}
            },
            {new: true}).then(profile=> {
               
                res.json(profile)
            }).then(profile=> res.json(profile))
        })
})

//update residence
router.post('/updateProfile/residence',  passport.authenticate('jwt', {session: false}), (req, res)=>{

    
    Profile.findOne({ userdata: req.user.id })
        .then(profile => {
           
           Profile.findOneAndUpdate( 
            {userdata: req.user.id },
            {$set : 
              {residence: req.body.residence}
            },
            {new: true}).then(profile=> {
               
                res.json(profile)
            }).then(profile=> res.json(profile))
        })
})

//update social links
router.post('/updateProfile/social',  passport.authenticate('jwt', {session: false}), (req, res)=>{

    
    profileFields = {}
    profileFields.email= req.user.email;
    if(req.body.youtube) profileFields.youtube = req.body.youtube ;
    if(req.body.twitter) profileFields.twitter = req.body.twitter ;
    if(req.body.instagram) profileFields.instagram = req.body.instagram;
   
    
    Profile.findOne({ userdata: req.user.id })
        .then(profile => {
           
           Profile.findOneAndUpdate( 
            {userdata: req.user.id },
            {$set : 
              {social: profileFields}
            },
            {new: true}).then(profile=> {
               
                res.json(profile)
            }).then(profile=> res.json(profile))
        })
})

router.delete('/institution/:id',  passport.authenticate('jwt', {session: false}),
        (req, res)=>{
           Profile.findOne({userdata: req.user.id})
               
                       .then(profile =>{
                           console.log(profile)
                           if(profile.institution.filter(institution=> institution._id.toString() === req.params.id)
                               .length <1)
                           {
                               return res.status(400).json({notstared:'No institution'})
                           }
                          const removeIndex = profile.institution.map(item=> item._id.toString()).indexOf(req.params.id)
                           profile.institution.splice(removeIndex, 1)
                          profile.save().then(profile =>{
                              console.log(profile)
                            console.log('removed')  
                            res.json(profile)})
                          
                       })
                       .catch((err)=> res.status(404).json(err))
            
       
       
       })


//report user
router.post('/report/:id/:ins_id',  passport.authenticate('jwt', {session: false}), (req, res)=> {
    User.findOne({_id: req.params.id})
                .then(user =>{
                   console.log('user is ', user)
                    Profile.findOne({userdata: req.params.id}).then(profile=> {
                        console.log('profile is ', profile)
                        if(profile.institution.filter(institution=>{
                            if(institution._id == req.params.ins_id){
                                if(institution.report.filter(report=> report.userdata== req.user.id).length>0){
                                    return res.json({message:'You already have reported this user!'})
                                } 
                                else {
                                    console.log('reporting...')
                                    console.log('report', institution.report)
                                    institution.report.push({
                                        userdata: req.user.id,
                                   });
                                    profile.save().then(post =>res.status(200).json(post))
                                }
                            }
                        }
                         )
                     ){

                }  })
             })
                .catch((err)=> {
                   console.log(err)
                    res.status(404).json(err)})
})


// remove report from user
router.post('/unreport/:id/:ins_id',  passport.authenticate('jwt', {session: false}), (req, res)=> {
    User.findOne({_id: req.params.id})
                .then(user =>{
                   console.log('user is ', user)
                    Profile.findOne({userdata: req.params.id}).then(profile=> {
                        console.log('profile is ', profile)
                        if(profile.institution.filter(institution=>{
                            if(institution._id == req.params.ins_id){
                                if(institution.report.filter(report=> report.userdata== req.user.id).length < 1){
                                    return res.json({message:'You have not reported this user!'})
                                } 
                                else {
                                    const removeIndex = institution.report.map(item=> item.userdata.toString()).indexOf(req.user.id)
                           institution.report.splice(removeIndex, 1)
                          profile.save().then(profile => res.json(profile))
                                }
                            }
                        }
                         )
                     ){

                }  })
             })
                .catch((err)=> {
                   console.log(err)
                    res.status(404).json(err)})
})



//block user 
router.post('/block/:id',  passport.authenticate('jwt', {session: false}), (req, res)=> {
        User.findOne({_id: req.params.id}).then(
            user=> {
               
                Profile.findOne({userdata: req.user.id}).then(
                    profile=> {
                        
                        if(profile.blockedUser.filter(block=> block.userdata== req.params.id).length > 0){
                            return res.json({message:'Already blocked'})
                        } else {
                            Profile.findOne({userdata: req.params.id}).then(
                                Profile2=> {
                                    
                                    profile.blockedUser.unshift({
                                        userdata: req.params.id,
                                        name: Profile2.name,
                                        profileImage:Profile2.profileImage 
                                        
                                    })
                                   
                                  profile.save().then((profile)=> res.json(profile)).catch(err=> console.log('err is ', err))
                                }
                            )
                           
                        }
                    }
                ).catch(err=> console.log('err2 is  ',err))
            }
        )
})





//unblock user 
router.post('/unblock/:id',  passport.authenticate('jwt', {session: false}), (req, res)=> {
    User.findOne({_id: req.params.id}).then(
        user=> {
           
            Profile.findOne({userdata: req.user.id}).then(
                profile=> {
                    
                    if(profile.blockedUser.filter(block=> block.userdata== req.params.id).length < 1){
                        return res.json({message:'You have not blocked this user yet'})
                    } else {
                      
                        const removeIndex = profile.blockedUser.map(item=> item.userdata.toString()).indexOf(req.params.id)
                           profile.blockedUser.splice(removeIndex, 1)
                          profile.save().then(profile => res.json(profile))
                       
                    }
                }
            ).catch(err=> console.log('err2 is  ',err))
        }
    )
})





//update profile image in user
router.post('/updateProfileImage',
upload.single('profileImage'),
 passport.authenticate('jwt', {session: false}),
  async (req, res, done)=> {
    const result = await cloudinary.uploader.upload(req.file.path)  
    console.log(result) 
    Profile.findOne({userdata: req.user.id}).exec()
            .then(users=> {
                if(!users){
                    console.log(users)
                  return res.status(401).json('No user')
                } else {
                    
                    console.log('user profile exists')
                    const profileofuser = ({
                       
                        profileImage: result.secure_url,
                        
                    })
                   User.findOneAndUpdate(
                        { email: req.user.email },
                        { $set : {profileImage: profileofuser.profileImage}},
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
 passport.authenticate('jwt', {session: false}),
upload.single('profileImage'),
  
  async (req, res, done)=> {
    console.log('it is here')
    const result = await cloudinary.uploader.upload(req.file.path)  
    console.log(result) 
    Profile.findOne({userdata: req.user.id}).exec()
            .then(users=> {
                if(!users){
                  return res.status(401).json('No user')
                } else {
                    
                    console.log('user profile exists')
                    const profile = ({
                       
                        profileImage: result.secure_url,
                        
                    })
                
                        Profile.findOneAndUpdate(
                            { userdata: req.user.id },
                            { $set : {profileImage: profile.profileImage}},
                            {new: true},
                        )
                   
                    .then(profile=> {
                        console.log('updated profile is ',profile)
                       return res.status(200).json(profile)
                    })
                   
                    .catch(err=> console.log(err))

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
            res.status(404).json({messages:'Something went wrong!'}) })
})



router.get('/allgroups', (req, res)=> {
    Group.find()
        .sort({date:-1})
        .exec()
        .then(group=>{
            console.log(group)
            res.status(200).json(group)})
        .catch(err=> {
            res.status(404).json({messages:'Something went wrong!'}) })
})



router.get('/allcolleagues', passport.authenticate('jwt', {session: false}),(req, res)=> {
   
    console.log('getting colleagues...')
const institutions = JSON.parse(req.query.institution)
   console.log(institutions)
    Profile.find({'institution.institution_name': institutions})
   
        .sort({date:-1})
       
        .exec()
        .then(user=>res.status(200).json(user))
        .catch(err=> {
            res.status(404).json({message:'Something went wrong!'}) })
})


//follow
router.post('/star/:id',  passport.authenticate('jwt', {session: false}),
 (req, res)=>{
     console.log(req.params.id)
   
      
    Profile.findOne({userdata: req.params.id})
    .then(profile =>{
       
        if(profile.stars.filter(star=> star.userdata.toString() == req.user.id)
            .length > 0)
        {
           return res.status(400).json({message:'You already follow this user'})
        }
        else {
            profile.stars.unshift({
                userdata: req.user.id,
                name:req.user.name,
                profileImage:req.user.profileImage
            
            });
            // const following = {
            //     userdata: req.params.id,
            //     name:profile.name,
            //     profileImage:profile.profileImage
            
            // }
            // Profile.findOne({userdata: req.user.id}).then(myProfile=> {
            //     myProfile.following.unshift(following)
            //     myProfile.save().then((profile)=>  console.log('following=', profile.following))
            // })
            console.log('star =',profile.stars)
           
            profile.save().then(post =>res.status(200).json(post))
        }
      }).catch((err)=> {
                console.log(err)
                res.status(404).json(err)
        })
      
        })

router.post('/star2/:id',  passport.authenticate('jwt', {session: false}),
(req, res)=>{
    
    Profile.findOne({userdata: req.params.id})
    .then(profile =>{
        
        if(profile.stars.filter(star=> star.userdata.toString() === req.user.id)
            .length > 0)
        {
            return res.status(400).json({message:'You already follow this user'})
        }
        else {
            // profile.stars.unshift({
            //     userdata: req.user.id,
            //     name:req.user.name,
            //     profileImage:req.user.profileImage
            
            // });
            const following = {
                userdata: req.params.id,
                name:profile.name,
                profileImage:profile.profileImage
            
            }
            Profile.findOne({userdata: req.user.id}).then(myProfile=> {
                myProfile.following.unshift(following)
                myProfile.save().then(profile =>{
                    console.log('prfile===', profile)
                    res.status(200).json(profile)})
            })
            // console.log('star =',profile.stars)
            
            // profile.save().then(post =>res.status(200).json(post))
        }
        }).catch((err)=> {
                console.log(err)
                res.status(404).json(err)
        })
        
        })

//unfollow
router.post('/unstar/:id',  passport.authenticate('jwt', {session: false}),
        (req, res)=>{
           
                Profile.findOne({userdata: req.params.id})
                .then(profile =>{
                           if(profile.stars.filter(star=> star.userdata.toString() == req.user.id)
                               .length == 0)
                           {
                               return res.status(400).json({notstared:'You have not given a star yet'})
                           }
                          const removeIndex = profile.stars.map(item=> item.userdata.toString()).indexOf(req.user.id)
                           profile.stars.splice(removeIndex, 1)
                       
                          profile.save().then(profile => res.json(profile))
                          
                       }).catch((err)=> res.status(404).json(err))
               
       
       
       })
//unfollow
router.post('/unstar2/:id',  passport.authenticate('jwt', {session: false}),
        (req, res)=>{
           
                Profile.findOne({userdata: req.params.id})
                .then(profile =>{
                           if(profile.stars.filter(star=> star.userdata.toString() == req.user.id)
                               .length == 0)
                           {
                               return res.status(400).json({notstared:'You have not given a star yet'})
                           }
                        //   const removeIndex = profile.stars.map(item=> item.userdata.toString()).indexOf(req.user.id)
                        //    profile.stars.splice(removeIndex, 1)
                          Profile.findOne({userdata:req.user.id}).then(myProfile=> {
                            const removeFromFollowing = myProfile.following.map(item=> item.userdata.toString()).indexOf(req.params.id)
                            myProfile.following.splice(removeFromFollowing, 1)
                            myProfile.save().then(profile => {
                                console.log('profile after unfollowing==', profile)
                                res.json(profile)})
                          })
                          
                          
                       }).catch((err)=> res.status(404).json(err))
               
       
       
       })

router.post('/unfollow/:id',  passport.authenticate('jwt', {session: false}),
(req, res)=>{
    
    Profile.findOne({userdata:req.user.id}).then(myProfile=> {

        if(myProfile.following.filter(star=> star.userdata.toString() == req.params.id)
        .length == 0)
    {
        return res.status(400).json({notstared:'You have not given a star yet'})
    }

        const removeFromFollowing = myProfile.following.map(item=> item.userdata.toString()).indexOf(req.params.id)
        myProfile.following.splice(removeFromFollowing, 1)
        myProfile.save().then(profile=> console.log(profile))
      })


})

//Search by name
router.get('/allusers', passport.authenticate('jwt', {session: false}), (req, res)=> {

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


router.get('/allusers/:userId', passport.authenticate('jwt', {session: false}), (req, res)=> {
    console.log(req.params.userId)
    Profile.findOne({userdata: req.params.userId})
       
       .exec()
        .then(profile=> {
            // console.log(user)
            // res.json(user)
            console.log('single user is',profile)
            
                    
            res.status(200).json(profile)
        })
        .catch(err=> console.log(err))
        
      
})

module.exports = router;





