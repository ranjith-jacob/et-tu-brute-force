const express = require("express");
const router = express.Router();

const Identity = require("../models/identity");

router.get("/", async (req, res) => {
    try {
        const getAllIdentities = await Identity.find({}).populate("owner");
        console.log("all of the Identities", getAllIdentities);
        // res.send("Identities index page");
        res.render("./identities/index.ejs", {
            identities: getAllIdentities,
        });
    } catch (error) {
        console.log(error); // consider error.message here
        res.redirect("/");
    }
});

router.get("/new", async (req, res) => {
    // res.send("Add a new identity here!");
    res.render("identities/new.ejs");
});

module.exports = router;