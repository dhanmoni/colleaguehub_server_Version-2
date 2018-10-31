

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userdata: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' },
    institution: {
        type: String,    
    },
    name: {
        type: String,
        required:true
    },
    profileImage:{
        type: String
    },
    status:{
        type: String,  
    },
    residence:{
        type: String
    },
    bio:{
        type: String
    },
    facebookId:{
        type: String,
        required: true
    },
    ig_username:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('profile', profileSchema);