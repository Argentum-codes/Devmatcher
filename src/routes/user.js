const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";

//get all the pending connexn req for the loggin in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const userId = loggedInUser._id;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: userId,
            status: "interested"
            }).populate("fromUserId", ["firstName", "lastName","photoUrl", "about", "skills", "age", "gender"]);//.populate("fromUserId", "firstName lastName");
        //}).populate("fromUserId", "firstName lastName");//can use a string instead of array



        res.json({message: "Data fetched successfully", data: connectionRequests});
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        //in connection request -> accepted, from or to user is  the user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ],
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){//use equals or tostring to compare to mongodb id cannot do with just ===
                return row.toUserId
            }else{
                return row.fromUserId
            }
        })

        res.json({message: "Connections fetched successfully", data});
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;