const validator = require('validator');
const isempty = require('./isEmpty')

module.exports = function validateLogin(data){
    let errors ={};

    data.email = !isempty(data.email) ? data.email :'';
    data.password = !isempty(data.password) ? data.password :'';
    


    if(validator.isEmpty(data.email)){
        errors.email = 'Email is required'
    }
    if(validator.isEmpty(data.password)){
        errors.password = 'Password is required'
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid'
    }
   
    return {
        errors,
        isValid:isempty(errors)
    }
}