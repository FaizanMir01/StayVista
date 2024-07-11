const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listings.js")
const Review = require("./models/review.js")
const path = require("path");
const app = express();
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/expressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")

const listings = require("./routes/listing.js");


app.use(express.urlencoded({ extended: true })); // Ensure this is placed before any route
app.use(express.json()); // Ensure this is placed before any route
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// connection
mongoose.connect("mongodb://localhost:27017/wanderlust").then(() => {
    console.log("database connection successful");
}).catch((err) => {
    console.log(err);
})


// Validate review function
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// root 
app.get("/", (req, res) => {
    res.send("root is working")
})

app.use("/listings", listings);

//revies Post route
app.post("/listings/:id/review",validateReview,wrapAsync( async(req,res)=>{

   let listing = await Listing.findById(req.params.id)
   let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
   await listing.save()

   res.redirect(`/listings/${listing._id}`)
   
console.log("Saved")

}))


//delete review route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}= req.params;

   await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not Found"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("port connected");
})
