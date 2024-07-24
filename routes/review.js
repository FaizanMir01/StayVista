const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listings.js")
const Review = require("../models/review.js")
const ExpressError = require("../utils/expressError.js")
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
//revies Post route
router.post("/",validateReview,wrapAsync( async(req,res)=>{

    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
     listing.reviews.push(newReview)
 
     await newReview.save()
    await listing.save()
    req.flash("success","New review added successfully");
 
    res.redirect(`/listings/${listing._id}`)
    
 console.log("Saved")
 
 }))
 
 
 //delete review route
 
 router.delete("/:reviewId", wrapAsync(async(req,res)=>{
     let {id, reviewId}= req.params;
    await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
     await Review.findByIdAndDelete(reviewId);
     req.flash("success"," Review deleted successfully");
     res.redirect(`/listings/${id}`)
 }))


module.exports= router;