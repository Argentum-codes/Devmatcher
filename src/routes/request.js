const express = require("express");
const {userAuth} = require("../middlewares/auth");
const  ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { connection } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    // const user = req.user;  

    // // console.log("sending Connection Request");
    // res.send("Connection Request sent by " + user.firstName );

    try{
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        //have to check whether userid present in db or not
        //have to check if sending request to self
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message:"User not found"});
        }
        

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status is not valid "+ status});
        }

        

        //check if there is an existing connection request between A to B already exists or A req from B to A is there
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
            
        })
        
        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection Request already exists"});
        }

       

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        if(status === "interested"){
            res.json({
                message: req.user.firstName + " is interested in " + toUser.firstName,
                data,
            })
        }else{
            res.json({
                message: req.user.firstName + " ignored " + toUser.firstName,
                data,
            })
        }

    }catch(err){
            res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    //after path think if u need a middleware -- here needed as user should be loggedin
    try{
        const loggedInUser = req.user;

        const allowedStatus = ["accepted", "rejected"];
        const {status, requestId} = req.params;
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status is not valid "});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(400).json({message:"Connection Request not found"});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message: "Connection Request " + status, data});
        //valdiate the status
        //req id should be valid

        //A => B
        //is B loggedin?(touserId person can accept or reject a req-- only if existing req in interested state)

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter;