const validator = require('validator');
const isempty = require('./isEmpty')

module.exports = function validateProfile(data){
    let errors ={};

    data.institution = !isempty(data.institution) ? data.institution :'';
   // data.status = !isempty(data.status) ? data.status :'';


    if(validator.isEmpty(data.institution)){
        errors.institution = 'Minimum 1 institution/group name is required!'
    }
    // if(validator.isEmpty(data.status)){
    //     errors.status = 'Status is required'
    // }
    return {
        errors,
        isValid:isempty(errors)
    }
}