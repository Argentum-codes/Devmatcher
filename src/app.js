const express = require('express');

const app = express();

app.use("/test" , (req, res) => {
    res.send("Hello from the server")
})

app.get("/user", (req, res) => {
    res.send({name: "John", age: 30})
})

app.post("/user", (req, res) => {
    res.send("Save data to the db")
})

app.delete("/user", (req, res) => {
    res.send("User Deleted Successfully")
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
