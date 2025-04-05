const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//post api to add a data to database-- signup the user
app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Argha",
        lastName: "Guha",
        emailId: "argha@guha.com",
        password: "123456",
    }

    const user = new User(userObj);//creating a new instance of the user model
    
    try{
        await user.save();//returns a promise( true for most mongoose func -- use async await)

    res.send("User created successfully");

    }catch (err) {
        res.status(400).send("Error creating user" + err.message);
    }
    
})

connectDB().then(() => {
    console.log("Connected to the database");
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
    
}).catch((err) => {
    console.log("Error connecting to the database", err);
})


//Data - base password
// k1nnd9X8m3gHkx8J