const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listings")
const app = express();

mongoose.connect("mongodb://localhost:27017/wanderlust").then(()=>{
    console.log("database connection succesfull");
}).catch((err)=>{
    console.log(err);
})


app.get("/",(req,res)=>{
    res.send("root is working")
})


app.get("/testListing",async (req,res)=>{
    let sampleListings =  new Listing({
        title:"My new Villa",
        description:"BY the beach",
        price:1200,
        location:"Calangute , Goa",
        country:"india"
    })
    await sampleListings.save();
    console.log("saved")
    res.send("working")
});


app.listen(8080,()=>{
    console.log("port connected");
})