const socket = require("socket.io")
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { timeStamp } = require("console");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

const initializeSocket = (server) => {        
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    })    
    
    io.on("connection", (socket) => {
        // Handle events
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
        })


        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text, timestamp }) => {
            const roomId = getSecretRoomId(userId, targetUserId);

            // Check if userId & targetuserId are friends

            // const existingConnectionRequest = await ConnectionRequest.findOne({
            //     $or: [
            //         {fromUserId: userId, toUserId: targetUserId, status: "accepted"},
            //         {fromUserId: targetUserId, toUserId: userId, status: "accepted"}
            //     ],
            // })

            // console.log("Existing: ", existingConnectionRequest);
            

            // if(!existingConnectionRequest){
                // DONT ALLOW TO CHAT
                //return res.status(400).json({message: "Connection Request Does not Exists!!"})
            // }
            
            // Save the messages to the database
            try{
                let chat = await Chat.findOne({
                    participants: { 
                        $all: [ userId, targetUserId ]
                    }
                })

                if(!chat){
                    chat = new Chat({
                        participants: [ userId, targetUserId ],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                })

                await chat.save();

                io.to(roomId).emit("messageReceived", { firstName, lastName, text, timestamp});  

            }catch(err){
                console.log(err.message)
            }
            
        })


        socket.on("disconnect", () => {
            
        })
    })
}


module.exports = initializeSocket