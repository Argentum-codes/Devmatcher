const express = require("express");
const {userAuth} = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {

    const user = req.user;  

    // console.log("sending Connection Request");
    res.send("Connection Request sent by " + user.firstName );
})

module.exports = requestRouter;