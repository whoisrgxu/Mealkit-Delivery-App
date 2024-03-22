/*************************************************************************************
* WEB322 - 2241 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Rong Gang Xu
* Student ID    : rgxu
* Course/Section: WEB322/NEE
*
**************************************************************************************/
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");

// Set up dotenv
const dotenv = require("dotenv");
dotenv.config({path: "./config/keys.env"});

// Set up express
const app = express();

// Set up EJS
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

// Set up Express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // Save the user to the global variable "locals".
    res.locals.user = req.session.user;
    res.locals.userType = req.session.userType;
    next();
})
// Set up body-parser
app.use(express.urlencoded({extended: false}));
// Load controllers into express
const generalController = require("./controllers/generalController");
const mealkitsController = require("./controllers/mealkitsController")

app.use("/", generalController);
app.use("/mealkits", mealkitsController);

app.use(express.static(path.join(__dirname, "/assets")));

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// *** DO NOT MODIFY THE LINES BELOW ***

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => {
    console.log("Connected to the MongoDB database.");
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(err => {
    console.log(`Can't connect to the MongoDB database: ${err}`);
})