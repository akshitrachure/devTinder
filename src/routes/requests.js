const express = require('express')

const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const requestRouter = express.Router();


//Sending Connection Request
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const connectionRequestData = new connectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const allowedStatus = ["ignored","interested"]

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type" + status})
        }


        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: "User " + toUserId + " not found!!"})
        }


        //Check if there is an existing connection request from fromUserId to toUserId
        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ],
        })
        if(existingConnectionRequest){
            return res.status(400).json({message: "Connection Request Already Exists!!"})
        }

        const data = await connectionRequestData.save()
            res.json({
                message: req.user.firstName + " is " + status + " in " + toUser.firstName,
                data
            });
        
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message)
    }

})


module.exports = requestRouter