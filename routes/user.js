const express= require("express");
const { route } = require("./listing");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const router = express.Router();



router.get("/signup",(req,res)=>{
    res.render("users/signup");
})

router.post("/signup",wrapAsync( async(req,res)=>{
    try{
        let {username,email,password}= req.body;
    const newUser = new User({email,username});
    const registeredUser= await User.register(newUser,password);
    req.flash("success","welcome to stayVista");
    res.redirect("/listings");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login")
})

router.post("/login",passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),async (req,res)=>{

    req.flash("success","Welcome back to StayVista");
    res.redirect("/listings");
})

router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success", "You are now logged out");
      res.redirect("/listings");
    });
  });



module.exports= router;