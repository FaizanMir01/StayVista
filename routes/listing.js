const express = require("express");
const router = express();
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listings.js")
const ExpressError = require("../utils/expressError.js")




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

// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings })
}))

// new Route create new post using this route
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
})

// show route -->view in detail a post 
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing })
}))

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing })
}))

// update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings")
}))

// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))

// create new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
}))

module.exports = router;