const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference to the user collexn
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {//can use enums in gender as well
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps: true,
})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});//1 means ascending -1 desc

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    //check if the form and to userid are same
    // or can use the .equals function as well
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()){
        throw new Error("Cannot send connection request to self");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel;