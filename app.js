const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

mongoose.connect("mongodb://localhost:27017/wanderlust").then(()=>{
    console.log("database connection succesfull");
}).catch((err)=>{
    console.log(err);
})


app.get("/",(req,res)=>{
    res.send("root is working")
})


app.listen(8080,()=>{
    console.log("port connected");
})