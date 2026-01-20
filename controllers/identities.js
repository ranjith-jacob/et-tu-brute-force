const express = require("express");
const router = express.Router();

const Identity = require("../models/identity");

router.get("/", async (req, res) => {
    try {
        const getAllIdentities = await Identity.find({
          owner: req.session.user._id // filters Identities by owner
        }).populate("owner");
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
    // req.body.pwdReused = req.body.pwdReused === "on" ? "true" : "false";
    await Identity.create(req.body);
    res.redirect("/identities");
});

router.get("/:identityId", async (req, res) => {
  try {
    // console.log("identityId: ", req.params.identityId);
    // res.send("Identities show page");
    
    const populatedIdentity = await Identity.findOne({ // uses .findOne instead of .findById as latter does not silo each user account's Identities
      owner: req.session.user._id, // now restricts Identities to viewing only by its owner
      _id: req.params.identityId // required syntax for .findOne
    }).populate("owner");

    if (!populatedIdentity) return res.redirect("/identities") //! change this to a 'not authorised' page
    res.render("identities/show.ejs", {
      identity: populatedIdentity
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:identityId", async (req, res) => {
  try {
    // console.log("identityId: ", req.params.identityId);
    // console.log("user: ", req.session.user);
    const identity = await Identity.findById(req.params.identityId);
    if (identity.owner.equals(req.session.user._id)) {
      // console.log("Permission granted");
      await identity.deleteOne();
      res.redirect("/identities");
    } else {
      // console.log("Permission denied");
      res.send("You don't have permission to do that.");
    }
    // res.send(`A DELETE request was issued for ${req.params.identityId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:identityId/edit", async (req, res) => {
  try {
    // console.log("identityId: ", req.params.identityId);
    // res.send("Identities edit view");

    const currentIdentity = await Identity.findById(req.params.identityId);
    res.render("identities/edit.ejs", {
      identity: currentIdentity
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;