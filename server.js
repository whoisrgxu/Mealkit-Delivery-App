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
const mealkits = require("./modules/mealkit-util");
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

// Set up dotenv
const dotenv = require("dotenv");
dotenv.config({path: "./config/keys.env"});

// Set up express
const app = express();

// Set up EJS
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

// Set up body-parser
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "/assets")));

const allMealkits = mealkits.getAllMealKits();
const featured = mealkits.getFeaturedMealKits(allMealkits);
const mealkitsByCategory = mealkits.getMealKitsByCategory(allMealkits);

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
    res.render("log-in", {
        title: "Log-in",
        validationMessages: {},
        values: {
            email: "",
            password: ""
        }
    });
})

app.get("/welcome", (req, res) => {
    res.render("welcome", {
        title: "Welcome",       
    });
})
// Submit log-in form
app.post("/log-in", (req, res) => {

    let passedValidation = true;

    console.log(req.body);

    const {email, password} = req.body;

    let validationMessages = {};

    // Email validation
    if (typeof email !== "string") {
        passedValidation = false;
        validationMessages.email = "The email is required";
    }
    else if (email.trim().length === 0){
        passedValidation = false;
        validationMessages.email = "Please enter a valid email address";
    } 

    // Password validation
    if (typeof password !== "string") {
        passedValidation = false;
        validationMessages.password = "You must specify a password.";
    }
    else if (password.trim().length === 0){
        passedValidation = false;
        validationMessages.password = "Please enter your password";
    } 
    if (passedValidation === false) {
        res.render("log-in", {
            title: "Log-in",
            validationMessages,
            values: req.body    
        });
    }
    else {
        res.redirect('/');
    }

})

app.get('/sign-up', (req, res) => {
    res.render("sign-up", {
        title: "Sign-up",
        validationMessages: {},
        values: {
            firstname: "",
            lastname: "",
            email: "",
            password: ""
        }    
    });
})

app.post("/sign-up", (req, res) => {

    console.log(req.body);

    const {firstname, lastname, email, password} = req.body;

    let passedValidation = true;
    let validationMessages = {};

    // First name validation
    if (typeof firstname !== "string") {
        passedValidation = false;
        validationMessages.firstname = "You must specify a first name.";
    }
    else if (firstname.trim().length === 0){
        passedValidation = false;
        validationMessages.firstname = "The first name is required";
    } 

    // Last name validation
    if (typeof lastname !== "string") {
        passedValidation = false;
        validationMessages.lastname = "You must specify a last name.";
    }
    else if (lastname.trim().length === 0){
        passedValidation = false;
        validationMessages.lastname = "The last name is required";
    } 
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (typeof email !== "string") {
        passedValidation = false;
        validationMessages.email = "You must specify an email.";
    }
    else if (email.trim().length === 0){
        passedValidation = false;
        validationMessages.email = "The email is required";
    } 
    else if (emailRegex.test(email) === false) {
        passedValidation = false;
        validationMessages.email = "Incorrect email format";
    } 

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,12}$/;
    if (typeof password !== "string") {
        passedValidation = false;
        validationMessages.password = "You must specify a password.";
    }
    else if (password.trim().length === 0){
        passedValidation = false;
        validationMessages.password = "The password is required";
    } 
    else if (passwordRegex.test(password) === false) {
        passedValidation = false;
        validationMessages.password = "Your password should be between 8 to 12 characters and contains at least one lowercase letter, uppercase letter, number and a symbol";
    }

    if (passedValidation) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        
        const msg = {
            to: email,
            from: "appledef@gmail.com",
            subject: "Welcome to KITCHAVST",
            html: 
                `Hi ${firstname} ${lastname},<br><br>
                 Congratulations and welcome to KITCHAVST!<br><br>
                 Your account has been successfully created. Here are your account details:<br><br>
                 User firstname: ${firstname}<br>
                 User lastname: ${lastname}<br>
                 Email: ${email}<br><br>
                 To get started, please visit our website at https://smoggy-red-blazer.cyclic.app and 
                 log in with your credentials.<br><br>
                 Than your for choosing KITCHAVST. We look forward to providing you with an exceptional 
                 experience.<br><br>
                 Best regards,<br><br>
                 Rong Gang Xu<br>`
        }
        sgMail.send(msg)
            .then(() => {
                res.redirect("/welcome"); 
            })
            .catch(err => {
                console.log(err);

                res.render("sign-up", {
                    title: "Sign-up",
                    validationMessages,
                    values: req.body    
                });
            })
    }
    else {
        res.render("sign-up", {
            title: "Sign-up",
            validationMessages,
            values: req.body    
        });
    }
})

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