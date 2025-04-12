const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth}= require("./middlewares/auth");

app.use(express.json());//to parse the incoming request body as json-- runs on every req for every route
app.use(cookieParser());

//post api to add a data to database-- signup the user
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("User not found");
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

            res.send("Login Successfull");
        }else{
            throw new Error("Invalid password");
        }

    }catch (err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
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

app.post("/sendConnectionRequest", userAuth, async (req, res) => {

    const user = req.user;  

    console.log("sending Connection Request");
    res.send("Connection Request sent by " + user.firstName );
})
// app.get("/user", async (req, res) => {
//     const useremailId = req.body.emailId;

//     try{
//         const users = await User.find({emailId : useremailId});//ans array of json
//         if(users.length === 0){
//             return res.status(404).send("User not found");
//         }else {
//             res.send(users);
//         }
        
//     } catch (err){
//         res.status(400).send("Error fetching user " + err.message);
//     }
    
// })

// app.get("/feed", async (req, res) => {
//     try{
//         const users = await User.find({});//ans array of json
//         if(users.length === 0){
//             return res.status(404).send("Users not found");
//         }else {
//             res.send(users);
//         }
        
//     } catch (err){
//         res.status(400).send("Error fetching users " + err.message);
//     }
// })

// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId;
//     try{
//         const user = await User.findByIdAndDelete(userId);
//         if(!user){
//             return res.status(404).send("User not found");
//         }else {
//             res.send("User deleted successfully");
//         }
        
//     } catch (err){
//         res.status(400).send("Error deleting user " + err.message);
//     }
// })

// app.patch("/user:userId", async (req, res) => {
//     const userId= req.params?.userId;
//     const data = req.body;
//     // console.log(data);
   
//     try{
//         const ALLOWED_UPDATES = [
//             "photourl", "about","gender", "skills", "age", "userId"
//         ]
    
//         const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
//         if(!isUpdateAllowed){
//             throw new Error("Invalid update - Not allowed");
//         }

//         if(data?.skills.length > 10){
//             throw new Error("Skills cannot be more than 10");
//         }

//         const user = await User.findByIdAndUpdate(userId, data, {
//             returnDocument: "after",
//             runValidators: true,
//         });
//         if(!user){
//             return res.status(404).send("User not found");
//         }else {
//             res.send("User Update successfully");
//         }
//     }catch(err){
//         res.status(400).send("UPDATE FAILED" + err.message);
//     }
// })

connectDB().then(() => {
    console.log("Connected to the database");
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
    
}).catch((err) => {
    console.log("Error connecting to the database ", err);
})


//Data - base password
// k1nnd9X8m3gHkx8J