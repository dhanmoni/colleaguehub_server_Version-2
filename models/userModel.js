

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        
    },
    first_name:{
        type: String
    },
    facebookId:{
        type:String
    },
    profile:{
        type:String
    },
    token:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
   
});

module.exports = mongoose.model('user', userSchema);