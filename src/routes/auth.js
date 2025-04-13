const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try{
        //Validation of data
        validateSignUpData(req);
        //utility or helper functions for such activities
        const {firstName, lastName, emailId, password} = req.body;
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);//returns a promise
        // console.log(passwordHash);

        // console.log(req.body);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            //fields other than these are ignored
        });//creating a new instance of the user model
    
    
        await user.save();//returns a promise( true for most mongoose func -- use async await)

        res.send("User created successfully");

    }catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
    
})


authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        
        // const isPasswordValid = await bcrypt.compare(password, user.password );
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            //Create a JWT token
            // const token = await jwt.sign({ _id : user._id}, "DEV@Baby10", {
            //     expiresIn: "1d"
            // });
            const token = await user.getJWT();
            // console.log(token);
            //Add the token to cookie and send the response back to the user
            //express--res.cookie
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1*24*60*60*1000),//1 day
            });

            res.send("Login Successful");
        }else{
            throw new Error("Invalid credentials");
        }

    }catch (err){
        res.status(400).send("ERROR: "+ err.message);
    }
}) 

authRouter.post("/logout", async (req, res) => {

    //might do some clean up activities before this eg., for the db

    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successful");//can chain res.cookie().send()
})

module.exports = authRouter;