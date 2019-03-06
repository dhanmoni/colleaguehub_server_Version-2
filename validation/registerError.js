const validator = require('validator');
const isempty = require('./isEmpty')

module.exports = function validateRegister(data){
    let errors ={};

    data.email = !isempty(data.email) ? data.email :'';
    data.password = !isempty(data.password) ? data.password :'';
    data.name = !isempty(data.name) ? data.name :'';


    if(validator.isEmpty(data.email)){
        errors.email = 'Email is required'
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid'
    }
    if(validator.isEmpty(data.password)){
        errors.password = 'Password is required'
    }
    if(!validator.isLength(data.password, {min:6, max:25})){
        errors.password = 'Password must be within 6 to 25 characters'
    }
   
    if(validator.isEmpty(data.name)){
        errors.name = 'Name is required'
    }
    return {
        errors,
        isValid:isempty(errors)
    }
}