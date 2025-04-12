const express = require("express");
const {userAuth} = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try{
        // const cookies = req.cookies;

        // const {token} = cookies;
        // if(!token){
        //     throw new Error("Invalid Token");
        // }
        // //validate token
        // const decodedMessage= await jwt.verify(token, "DEV@Baby10");
        // // console.log(decodedMessage);

        // const {_id} =decodedMessage;
        // // console.log("logged in user is: "+ _id);

        // const user = await User.findById(_id);

        // if(!user){
        //     throw new Error("User not found");
        // }

        // // console.log(cookies);
        // res.send(user);
        const user = req.user;
        res.send(user);
    }catch (err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

module.exports = profileRouter;