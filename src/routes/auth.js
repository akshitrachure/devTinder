const express = require('express')
const bcrypt = require('bcrypt')
const validator = require('validator')
const cookieParser = require('cookie-parser')

const {validateSignupData} = require('../utils/validation')
const User = require('../models/user')
const authRouter = express.Router()


authRouter.use(express.json())
authRouter.use(cookieParser())


const USER_SAFE_DATA = "firstName lastName age gender about photoUrl skills"


//Signup
authRouter.post('/signup', async (req,res)=>{
    try{
        //Validate the data
        validateSignupData(req);
        const {firstName, lastName, emailId, password, age, skills, gender} = req.body
        
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password,10);

        //Creating a new instance of the User model
        const user = new User({
            firstName, lastName, emailId, password: passwordHash, age, gender, skills
        });

        const savedUser = await user.save();

        //create a token
        const token = await savedUser.getJWT();

        //Create a cookie and send it in the response to the user
        res.cookie('token', token, {expires: new Date(Date.now() + 7 * 24 * 3600000)}) // expires in 8hours
        res.json({message: "User data added to the database", data: savedUser});
    }catch(err){
        res.status(400).json({message: "ERROR: "+ err.message, data: "ERROR: "+ err.message})
    }
})



//Login
authRouter.post('/login', async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("Please provide a valid email address")
        }

        const user = await User.findOne({emailId: emailId})
        // .select(USER_SAFE_DATA)
        if(!user){
            throw new Error("Invalid Credentials!!")
        }

        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid){
            throw new Error("Invalid credentials!!");
        }else{
            //create a token
            const token = await user.getJWT();

            //Create a cookie and send it in the response to the user
            res.cookie('token', token, {expires: new Date(Date.now() + 7 * 24 * 3600000)}) // expires in 8hours
            res.json({message: "Login successful!!", data: user})
        }

    }catch(err){
        res.status(400).json({message: "ERROR: "+ err.message, data: "ERROR: "+ err.message})
    }
})



//Logout
authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {expires: new Date(Date.now())})
    res.json({message: "Logout successful", data: "Logout successful"})
})



module.exports = authRouter