const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored','rejected','interested','accepted'],
            message: `{VALUE} is not a correct status type`
        },
    },
}, 
{
    timestamps: true,
})


//setting the compound index on fromUserId+toUserId to fasten up the DB search process
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})


connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this
    //Check if fromUserId === toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})



const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = connectionRequestModel