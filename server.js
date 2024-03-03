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
let mealkits = require("./modules/mealkit-util");
const app = express();

app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

const allMealkits = mealkits.getAllMealKits();
const featured = mealkits.getFeaturedMealKits(allMealkits);
const mealkitsByCategory = mealkits.getMealKitsByCategory(allMealkits);

// Add your routes here
// e.g. app.get() { ... }
app.get('/', (req, res) => {
    res.render("home", {featured, title: "home"});
})

app.get('/on-the-menu', (req, res) => {
    res.render("on-the-menu", {mealkitsByCategory, title: "on-the-menu"});
})

app.get('/pricing', (req, res) => {
    res.send("This is a page about pricing.");
})
app.get('/faq', (req, res) => {
    res.send("This page includes frequent asked questions.");
})
app.get('/gift-cards', (req, res) => {
    res.send("This page includes gift cards information.");
})
app.get('/Sustainability', (req, res) => {
    res.send("This page demonstrates how we achieve long-term sustainability.");
})
app.get('/log-in', (req, res) => {
    res.render("log-in", {title: "Log-in"});
})
app.get('/sign-up', (req, res) => {
    res.render("sign-up", {title: "Sign-up"});
})
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
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);