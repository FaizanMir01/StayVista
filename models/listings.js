const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:{
        type:String,
    },
    description:String,
    image :{
        filename:String,
        url:String
        /* default:"https://images.unsplash.com/photo-1709828593321-48973262f23e?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>v===" "?"https://images.unsplash.com/photo-1707327259268-2741b50ef5e5?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    } */},
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports= Listing;