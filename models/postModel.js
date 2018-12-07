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
    institution:{
        type: String
       
    },
    name:{
        type: String
    },
    profileImage:{
        type: String
    },
    facebookId:{
        type: String
    },
    likes:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            facebookId:{
                type:String
            },
            name:{
                type: String
            },
            avatar:{
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
            user:{
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
            avatar:{
                type: String
            },
            facebookId:{
                type:String
            },
            date:{
                type: Date,
                default: Date.now
            },
            likes: [
               { user:{
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                },
                facebookId:{
                    type:String
                },
                name:{
                    type: String
                },
                avatar:{
                    type: String
                },
                date:{
                    type: Date,
                    default: Date.now
                }}
            ]
               
           
        }
    ],
   
    date:{
        type: Date,
        default: Date.now
    },

   
})

PostSchema.plugin(ttl, { ttl: 86400000 });
module.exports= mongoose.model('post', PostSchema);