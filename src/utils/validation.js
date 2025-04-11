const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    // else if ( firstname.length < 2 || firstname.length > 50){
    //     throw new Error("First name should be between 2 and 50 characters");
    // }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a Strong Password");
    }
}

module.exports = {
    validateSignUpData,
}