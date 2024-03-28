const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listings")
const path = require("path");
const app = express();


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))








// connection
mongoose.connect("mongodb://localhost:27017/wanderlust").then(()=>{
    console.log("database connection succesfull");
}).catch((err)=>{
    console.log(err);
})

// root 
app.get("/",(req,res)=>{
    res.send("root is working")
})
// index route
app.get("/listings", async (req,res)=>{
     const allListings = await Listing.find({});
     res.render("./listings/index.ejs",{allListings})
})

// new Route create new post using this route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
})

// show route -->view in detail a post 
app.get("/listings/:id",async (req,res)=>{
    let  {id}= req.params
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})

app.post("/listings",async(req,res)=>{
    const listing = new Listing(req.body.listing);

    await listing.save()
    res.redirect("/listings");






})
/* app.get("/testListing",async (req,res)=>{
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
}); */


app.listen(8080,()=>{
    console.log("port connected");
})