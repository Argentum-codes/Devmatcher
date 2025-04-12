const express = require("express");
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("invalid Edit Request");
            //can send res.send here but above method catch cathes the error and displays it
        }
        //using validator library-- check phtourl about length max
        const loggedInIUser = req.user;//auth middleware attaches the user to req-- can see with console.log(user)

        // loggedInIUser.firstName = req.body.firstName;
        //bad way above -- better way loop over all the keys comingf in req.body
        Object.keys(req.body).forEach((key) => (loggedInIUser[key] = req.body[key]));

        await loggedInIUser.save();

        // res.send(`${loggedInIUser.firstName}, your profile was updated successfully!`);

        //better was to send response
        res.json({
         message: `${loggedInIUser.firstName}, your profile was updated successfully!`,
         data: loggedInIUser,
        })//allows for UI update

    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    //make the forgot password api
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw new Error("Old password and new password must be provided.");
        }

        if (!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            throw new Error("New password is not strong enough. It must include at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 special symbol.");
        }

        const user = req.user;

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Old password is incorrect.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({
            message: "Password updated successfully.",
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }

})

module.exports = profileRouter;