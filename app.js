const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listings")
const Review = require("./models/review.js")
const path = require("path");
const app = express();
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/expressError")
const { listingSchema } = require("./schema.js")


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

// Validate listing function
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
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

// index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings })
}))

// new Route create new post using this route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
})

// show route -->view in detail a post 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
}))

// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing })
}))

// update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings")
}))

// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))

// create new listing
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
}))
//revies Post route
app.post("/listings/:id/review", async(req,res)=>{

   let listing = await Listing.findById(req.params.id)
   let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)

    await newReview.save()
   await listing.save()

   res.redirect(`/listings/${listing._id}`)
   
console.log("Saved")

})


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
