const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js")
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash= require("connect-flash")


app.use(express.urlencoded({ extended: true })); // Ensure this is placed before any route
app.use(express.json()); // Ensure this is placed before any route
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions=
    {
        secret:"supersecret",
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httpOnly:true
        }
    }


// connection
mongoose.connect("mongodb://localhost:27017/wanderlust").then(() => {
    console.log("database connection successful");
}).catch((err) => {
    console.log(err);
})




// root 
app.get("/", (req, res) => {
    res.send("root is working")
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



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
