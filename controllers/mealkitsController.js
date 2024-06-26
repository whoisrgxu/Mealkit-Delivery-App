const path = require("path");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const mealkitsModel = require("../models/mealkitsModel");


router.get('/on-the-menu', (req, res) => {

    const showButton = false;
    mealkitsModel.find()
        .then(allMealkits => {
            // To get the Mealkits by categary list
            let categories = [];
            let mealkitsByCategory = [];

            for (let i = 0; i < allMealkits.length; i++) {

                if (categories.includes(allMealkits[i].category) === false) {

                    categories.push(allMealkits[i].category);
                }
            }
            categories.forEach((category) => {
                mealkitsByCategory.push({categoryName: category, mealkits: []});
            })
            for (let i = 0; i < allMealkits.length; i++) {

                for (let j = 0; j < categories.length; j++) {

                    if (allMealkits[i].category === categories[j]) {

                        mealkitsByCategory[j].mealkits.push(allMealkits[i]);
                        break;
                    }
                }
            }

            // render the on-the-menu view
            res.render("mealkits/on-the-menu", {
                title: "on-the-menu",
                showButton,
                mealkitsByCategory
            });
        })
        .catch(() => {
            console.log(err);
            res.redirect("/");
        })      
})

router.get('/list', (req, res) => {
    const showButton = true;
    if (req.session.userType === "clerk") {

        mealkitsModel.find().sort({title: 1})
            .then(allMealkits => {

                res.render("mealkits/list", {
                    title: "Mealkit List",
                    showButton,
                    allMealkits
                });
            })
            .catch(() => {
                console.log(err);
                res.redirect("/");
            })  
    }
    else {
        res.status(401).render("general/error", {title: 'Unauthorized'});
    }
})

router.get("/add", (req, res) =>{

    if(req.session.userType === "clerk") {
        res.render("mealkits/addMealkit", {
            title: "Add Mealkit",
            fileTypeWarning: "",
            mealkit: {}
        });
    }
    else {
        res.status(401).render("general/error", {title: 'Unauthorized'});
    }
})

router.post("/add", (req, res) =>{
   
    const {title, includes, description, category, price, cookingTime, servings} = req.body;

    let featuredMealKit = false;
    
    if (req.body.featuredMealKit) {
        
        featuredMealKit = true;
    }
    let imageUrl = "Empty";
    const newMealkit = new mealkitsModel({ title, includes, description, category, price, cookingTime, servings, imageUrl, featuredMealKit});

    newMealkit.save()
        .then(mealkitSaved => {
            // Create a unique name for the picture, so that it can be stored in the static folder.
            const imageUrlFile = req.files.imageUrl;
            const uniqueName = `mealkit-pic-${mealkitSaved._id}${path.parse(imageUrlFile.name).ext}`;
            const allowedExtensions = ['jpg', 'jpeg', 'gif', 'png'];

            if (allowedExtensions.includes(path.parse(imageUrlFile.name).ext.substring(1).toLowerCase())){

                // Copy the image data to a file on the system.
                imageUrlFile.mv(`assets/mealkit-pics/${uniqueName}`)
                    .then(() => {
                        // Successful
                        // Update the document so the mealkit pic is populated.
                        mealkitsModel.updateOne({
                            _id: mealkitSaved._id
                        }, {
                            imageUrl: uniqueName
                        })
                            .then(() => {
                                // Successfully updated document
                                console.log("Updated the mealkit pic");
                                res.redirect("/mealkits/list");
                            })
                            .catch(err => {
                                console.group("Error updating document... " + err);
                                res.redirect("/mealkits/list");
                            })
                    })
                    .catch(err => {
                        console.group("Error updating the mealkit pic... " + err);
                        res.redirect("/mealkits/list");
                    })
            }
            else {
                const fileTypeWarning = "the selected file type is not allowed!"
                mealkitsModel.deleteOne({
                    _id: mealkitSaved._id
                })
                .then(() => {
                    res.render("mealkits/addMealkit", {
                        title: "Add Mealkit",
                        fileTypeWarning,
                        mealkit: mealkitSaved
                    })
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => {
            console.log(`Error adding mealkit to the database ... ${err}`);
            res.render("mealkits/addMealkit", {title: "Add Mealkit"});
        })

})

router.get("/edit/:id", (req, res) => {

    if(req.session.userType === 'clerk') {
        const id = req.params.id;
        mealkitsModel.findOne({_id: id})
            .then ( (mealkit) => {
                res.render("mealkits/editMealkit", {
                    title: "Edit Mealkit",
                    fileTypeWarning: "",
                    mealkit
                })
            })
            .catch(err => {
                console.log("Couldn't find any documents..." + err);
                res.redirect("/mealkits/list");
            })
    }
    else res.status(401).render("general/error", {title: 'Unauthorized'});
})


router.post("/edit/:id", (req, res) => {

    const id = req.params.id;

    const fileTypeWarning = "";
    
    const {title, includes, description, category, price, cookingTime, servings} = req.body;
    
    let imageUrlFile;

    imageUrlFile = req.files.imageUrl;

    let featuredMealKit = false;
    
    if (req.body.featuredMealKit) {
        
        featuredMealKit = true;
    }
    // Find the existing document's imageUrl
    let existingUrl;
    
    mealkitsModel.findOne({_id: id})
        .then(item => {
            existingUrl = item.imageUrl;
            const allowedExtensions = ['jpg', 'jpeg', 'gif', 'png'];
            if (allowedExtensions.includes(path.parse(imageUrlFile.name).ext.substring(1).toLowerCase())){

                mealkitsModel.updateOne({_id: id}, {
                    $set: {title, includes, description, category, price, cookingTime, servings, featuredMealKit}
                })
                .then(() => {
                
                    // Copy the image data to a file on the system.
                    imageUrlFile.mv(`assets/mealkit-pics/${existingUrl}`)
                        .then(() => {
                            console.log("Successfully move the updated pic.");
                            res.redirect("/mealkits/list"),{
                                title: "Edit Mealkit",
                                fileTypeWarning,
                                mealkit: req.body
                            }

                        })
                        .catch(err => {
                            console.log("Couldn't move the pic..." + err);
                            res.redirect("/mealkits/edit");      
                        });         
                })
            }
            else {
                fileTypeWarning = "the selected file type is not allowed!"
        
                res.render("mealkits/editMealkit", {
                    title: "Edit Mealkit",
                    fileTypeWarning,
                    mealkit: req.body
                })     
            }
        })
        .catch(err => {         
            console.log(err);
            res.render("mealkits/editMealkit"),{
                title: "Edit Mealkit",
                fileTypeWarning,
                mealkit: req.body
            }
        });
})

router.get("/remove/:id", (req, res) => {

    if(req.session.userType === 'clerk') {
        
        const id = req.params.id;

        mealkitsModel.findOne({_id: id})
            .then ( (mealkit) => {
                res.render("mealkits/removeMealkit", {
                    title: "Remove Mealkit",
                    mealkit
                })
            })
            .catch(err => {
                console.log("Couldn't find any documents..." + err);
                res.redirect("/mealkits/list");
            })
    }
    else res.status(401).render("general/error", {title: 'Unauthorized'});
})

router.post("/remove/:id", (req, res) => {
   
    const id = req.params.id;
    mealkitsModel.findOne({_id: id})
        .then(mealkit => {
            // Construct the image file path
            const imagePath = path.join(__dirname, '..', 'assets', 'mealkit-pics', mealkit.imageUrl);
            fs.unlink(imagePath, (err) => {

                if (err) console.error('Error deleting the file:', err);
                else console.log('File deleted successfully');
            });
            mealkitsModel.deleteOne({_id: id})
                .then (() => {
                    res.redirect("/mealkits/list")
                })
                .catch(err => {
                    console.log("Couldn't delete the document..." + err);
                    res.redirect(`/mealkits/remove/${id}`);
                })
        })
        .catch(err => {
            console.log("Couldn't find the document..." + err);
            res.redirect(`/mealkits/remove/${id}`);
        })

})

module.exports = router;