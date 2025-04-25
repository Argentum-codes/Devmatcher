const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        //read the token form the req cookies - 
        const cookies = req.cookies;

        const {token} = cookies;
        if(!token){
            return res.status(401).send("Please Login");
        }

        //validate the token and 
        const decodedObj = await jwt.verify(token, "DEV@Baby10");

        const {_id}= decodedObj;

        //find  the  user
        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found")
        }
        req.user = user; 
        next()
        //attach the user ot req obj
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }

}

module.exports = {
    userAuth,
}