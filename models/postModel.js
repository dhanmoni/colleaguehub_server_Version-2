const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ttl = require('mongoose-ttl')



const PostSchema = new Schema({
    userdata:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text:{
        type: String
    },
    postImage:
    {   
       type: String
     },
    institution: [],
    name:{
        type: String
    },
    profileImage:{
        type: String
    },
   
    likes:[
        {
            userdata:{
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
           
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
    comments:[
        {
            userdata:{
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text:{
                type: String,
                required: true
            },
            name:{
                type: String
            },
            profileImage:{
                type: String
            },
           
            date:{
                type: Date,
                default: Date.now
            },
            likes: [
               { userdata:{
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                },
               
                name:{
                    type: String
                },
                profileImage:{
                    type: String
                },
                date:{
                    type: Date,
                    default: Date.now
                }}
            ],
            comments:[
                {
                    userdata:{
                        type: Schema.Types.ObjectId,
                        ref: 'users'
                    },
                    text:{
                        type: String,
                        required: true
                    },
                    name:{
                        type: String
                    },
                    profileImage:{
                        type: String
                    },
                   
                    date:{
                        type: Date,
                        default: Date.now
                    },
                   
                       
                   
                }
            ],
               
           
        }
    ],
   
    date:{
        type: Date,
        default: Date.now
    },

   
})

PostSchema.plugin(ttl, { ttl: 86400000 });
module.exports= mongoose.model('post', PostSchema);