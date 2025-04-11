const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());//to parse the incoming request body as json-- runs on every req for every route

//post api to add a data to database-- signup the user
app.post("/signup", async (req, res) => {

    console.log(req.body);

    const user = new User(req.body);//creating a new instance of the user model
    
    try{
        await user.save();//returns a promise( true for most mongoose func -- use async await)

        res.send("User created successfully");

    }catch (err) {
        res.status(400).send("Error creating user" + err.message);
    }
    
})

app.get("/user", async (req, res) => {
    const useremailId = req.body.emailId;

    try{
        const users = await User.find({emailId : useremailId});//ans array of json
        if(users.length === 0){
            return res.status(404).send("User not found");
        }else {
            res.send(users);
        }
        
    } catch (err){
        res.status(400).send("Error fetching user " + err.message);
    }
    
})

app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});//ans array of json
        if(users.length === 0){
            return res.status(404).send("Users not found");
        }else {
            res.send(users);
        }
        
    } catch (err){
        res.status(400).send("Error fetching users " + err.message);
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).send("User not found");
        }else {
            res.send("User deleted successfully");
        }
        
    } catch (err){
        res.status(400).send("Error deleting user " + err.message);
    }
})

app.patch("/user", async (req, res) => {
    const userId= req.body.userId;
    const data = req.body;
    // console.log(data);
    try{
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true,
        });
        if(!user){
            return res.status(404).send("User not found");
        }else {
            res.send("User Update successfully");
        }
    }catch(err){
        res.status(400).send("UPDATE FAILED" + err.message);
    }
})

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