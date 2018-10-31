const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userdata:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text:{
        type: String,
        required: true
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
            }
        }
    ],
   
    date:{
        type: Date,
        default: Date.now
    },

    createdAt: 
    { type: Date, expires: 86400000, default: Date.now }
})

module.exports= mongoose.model('post', PostSchema);