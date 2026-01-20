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

router.post("/", async (req, res) => {
    // console.log("Who is the user", req.session.user._id);
    req.body.owner = req.session.user._id;
    req.body.pwdReused = req.body.pwdReused === "on" ? true : false;
    req.body.storedInPwdManager = req.body.storedInPwdManager === "on" ? true : false;
    req.body.mfaPresent = req.body.mfaPresent === "on" ? true : false;
    req.body.pwnedStatus = req.body.pwnedStatus === "on" ? true : false;
    console.log("Form data received", req.body);
    // req.body.pwdReused = req.body.pwdReused === "on" ? true : false;
    await Identity.create(req.body);
    res.redirect("/identities");
});

module.exports = router;