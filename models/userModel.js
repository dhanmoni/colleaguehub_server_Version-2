

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
    name: {
        type: String,
        
    },
    first_name:{
        type: String
    },
    email:{
        type: String,
       
    },
    password:{
        type: String,
      
    },
   
    profileImage: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
   
   
});

module.exports = mongoose.model('user', userSchema);