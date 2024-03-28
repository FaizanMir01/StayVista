const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js")


mongoose.connect("mongodb://localhost:27017/wanderlust").then(()=>{
    console.log("database connection succesfull");
}).catch((err)=>{
    console.log(err);
})


const initDB = async ()=>{
    await Listing.deleteMany({});
    console.log("data was deleted")
    await Listing.insertMany(initData.data);
    console.log("data was initailized")
    
}
initDB();