const express = require('express')

const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const userRouter = express.Router()


const USER_SAFE_DATA = "firstName lastName age gender about photoUrl skills"



//GET all the pending connection requests received by the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user

        const connectionRequestData = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_DATA)
     // }).populate("fromUserId", ["firstName", "lastName", "age", "about", "photoUrl"])

        res.json({message: "Data fetched successfully!!",  data: connectionRequestData})

    }
    catch(err){
        res.status(400).json({message: "ERROR: "+ err.message, data: "ERROR: "+ err.message})
    }
})



//GET all the connections(matches) for the loggedIn user
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user

        const connectionRequestData = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequestData.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId
            }else{
                return row.fromUserId
            }
        })

        res.json({message: "Connections fetched successfully!!", data})

    }
    catch(err){
        res.status(400).json({message: "ERROR: "+ err.message, data: "ERROR: "+ err.message})
    }
})




userRouter.get('/user/feed', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        //Find all connection requests which the loggedIn user already sent request to/received by other user
        const connectionRequestData = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
        

        const hideUsersFromFeed = new Set()
        connectionRequestData.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        

        res.json({message: "User details Fetched", data: users})
    }
    catch(err){
        res.status(400).json({message: "ERROR: "+ err.message, data: "ERROR: "+ err.message})
    }
})


module.exports = userRouter