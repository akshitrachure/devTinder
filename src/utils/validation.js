const validator = require('validator')

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password, age, gender, photoUrl} = req.body
    if(!firstName || !lastName){
        throw new Error("Please enter firstname and lastname")
    }else if(firstName.length<4 || firstName.length>50){
        throw new Error("Firstname should be 4-50 characters")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter a valid email address")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }else if(age<18){
        throw new Error("The minimum age limit is 18")
    }else if(!['Male','Female','Others'].includes(gender)){
        throw new Error("Please select a valid gender")
    }
}

module.exports = {
    validateSignupData,
}