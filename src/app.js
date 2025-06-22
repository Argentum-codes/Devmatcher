const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const cors = require('cors');

require("dotenv").config();//to read the env variables from .env file

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());//to parse the incoming request body as json-- runs on every req for every route
app.use(cookieParser());

//post api to add a data to database-- signup the user


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



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
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port 3001');
    });
    
}).catch((err) => {
    console.log("Error connecting to the database ", err);
})


//Data - base password
// k1nnd9X8m3gHkx8J