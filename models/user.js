const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const passportLocalMongoose= require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    //username and password automatically genrated by pssport local mongoose
});

userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model('User', userSchema);