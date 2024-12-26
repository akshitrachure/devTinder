const express = require('express')

const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const requestRouter = express.Router();


//Sending Connection Request
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const connectionRequestData = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const allowedStatus = ["ignored","interested"]

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: " + status})
        }


        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: "User " + toUserId + " not found!!"})
        }


        //Check if there is an existing connection request from fromUserId to toUserId
        const existingConnectionRequest = await ConnectionRequest.findOne({
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
        res.status(400).json({message: "ERROR: "+ err.message, data: "ERROR: "+ err.message})
    }

})



requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try{
        const requestId = req.params.requestId
        const toUserId = req.user._id
        const status = req.params.status

        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: " + status})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: toUserId,
            status: "interested"
        })

        if(!connectionRequest){
            return res.status(400).json({message: "Connection request not found!!"})
        }

        connectionRequest.status = status

        const data = await connectionRequest.save();

        res.json({message: "Connection Request is " + status , data})
    }
    catch(err){
        res.status(400).json({message: "ERROR: "+ err.message, data: "ERROR: "+ err.message})
    }
})


module.exports = requestRouter