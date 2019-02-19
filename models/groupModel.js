

const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    
    userdata: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' },
       
    institution_name: {
            type: String
        },
    description: {
            type: String
        },
        
    private: Boolean,
    secret_code: String,
       
    
    createdBy: String,
   
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('group', groupSchema);