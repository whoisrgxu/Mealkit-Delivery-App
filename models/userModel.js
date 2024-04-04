const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Create a Schema for our users collection
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
       type: String,
       required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre("save", function (next) {

    let user = this;

    // Generate a unique SALT.
    bcryptjs.genSalt()
    .then(salt => {
        // Hash the password using the SALT;
        bcryptjs.hash(user.password, salt)
        .then(hashedPwd => {
            user.password = hashedPwd;
            next();
        })
        .catch(err => {
            console.log(`Error occurred when hashing ... ${err}`);
        });
    })
    .catch(err => {
        console.log(`Error occurred when salting ... ${err}`);
    });
});

// Create a model using the nameSchema Schema
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;