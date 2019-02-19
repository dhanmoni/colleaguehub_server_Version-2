

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    
    userdata: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' },
        institution: String,
    institution: [{
           
        userdata: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user' },
        institution_name: {
            type: String
        },
        description: {
            type: String
        },
        report:[
            {  userdata: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user' },
               
                date:{
                    type: Date,
                    default: Date.now
                }
            }
        ],
        private: Boolean,
        secret_code: String,
        date:{
            type: Date,
            default: Date.now
        },
    }],
    activeGroup:[
        {
           
            userdata: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user' },
            institution_name: {
                type: String
            },
            description: {
                type: String
            },
            report:[
                {  userdata: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'user' },
                   
                    date:{
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            private: Boolean,
            secret_code: String,
            date:{
                type: Date,
                default: Date.now
            },
        }
    ],
    pro:{
        type:Boolean
    },
    
    blockedUser:[
        { 
             userdata: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user' },
           
            name:{
                type: String
            },
            profileImage:{
                type: String
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    blockedGroup:[
        { 
                 
        userdata: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user' },
        institution_name: {
            type: String
        },
        
       
        date:{
            type: Date,
            default: Date.now
        },
        }
    ],
    name: {
        type: String,
        
    },
    profileImage:{
        type: String
    },
   
    residence:{
        type: String
    },
    bio:{
        type: String
    },
   
    social : {
        twitter:{
            type: String
        },
        youtube:{
            type: String
        },
        
        instagram:{
            type: String
        },
        
        email:{
            type: String
        } 
        
       
    },
    skills: [
        {
            title: String,
           
        }
    ],
    stars:[
        { 
             userdata: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user' },
           
            name:{
                type: String
            },
            profileImage:{
                type: String
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    following:[
        { 
            userdata: { 
           type: mongoose.Schema.Types.ObjectId, 
           ref: 'user' },
          
           name:{
               type: String
           },
           profileImage:{
               type: String
           },
           date:{
               type: Date,
               default: Date.now
           }
       }
    ],
   

    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('profile', profileSchema);