const express = require('express')

const { validateProfileEditData } = require('../utils/validation')
const { userAuth } = require('../middlewares/auth')
const profileRouter = express.Router()



//GET user profile
profileRouter.get('/profile/view', userAuth, async (req, res)=>{
    try{
        const user = req.user;
        res.send(user)
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})



//EDIT user profile
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Edit is not allowed for some of the fields")
        }

        const loggedInUser = req.user

        Object.keys(req.body).forEach(field => loggedInUser[field] = req.body[[field]])

        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your profile is updated successfully!`);

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})



module.exports = profileRouter