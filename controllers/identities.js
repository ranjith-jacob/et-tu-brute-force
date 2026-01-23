const express = require("express");
const router = express.Router();

const Identity = require("../models/identity");

router.get("/", async (req, res) => {
    try {
        const getAllIdentities = await Identity.find({
          owner: req.session.user._id
        }).populate("owner");
        res.render("./identities/index.ejs", {
            identities: getAllIdentities,
        });
    } catch (error) {
        res.redirect("/");
    }
});

router.get("/new", async (req, res) => {
    res.render("identities/new.ejs");
});

router.post("/", async (req, res) => {
    req.body.owner = req.session.user._id;

    req.body.pwdReused = req.body.pwdReused === "on" ? true : false;
    req.body.storedInPwdManager = req.body.storedInPwdManager === "on" ? true : false;
    req.body.mfaPresent = req.body.mfaPresent === "on" ? true : false;
    req.body.pwnedStatus = req.body.pwnedStatus === "on" ? true : false;

    await Identity.create(req.body);
    res.redirect("/identities");
});

router.get("/:identityId", async (req, res) => {
  try {
    const populatedIdentity = await Identity.findOne({
      owner: req.session.user._id,
      _id: req.params.identityId
    }).populate("owner");

    if (!populatedIdentity) return res.redirect("/identities")
    res.render("identities/show.ejs", {
      identity: populatedIdentity
    });
  } catch (error) {
    res.render("error.ejs", {
        msg: "Resource not found!"
    });
  }
});

router.delete("/:identityId", async (req, res) => {
  try {
    const identity = await Identity.findById(req.params.identityId);
    if (identity.owner.equals(req.session.user._id)) {
      await identity.deleteOne();
      res.redirect("/identities");
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/:identityId/edit", async (req, res) => {
  try {
    const currentIdentity = await Identity.findById(req.params.identityId);
    res.render("identities/edit.ejs", {
      identity: currentIdentity
    });
  } catch (error) {
    res.redirect("/");
  }
});

router.put("/:identityId", async (req, res) => {
  try {
    req.body.pwdReused = req.body.pwdReused === "on" ? true : false;
    req.body.storedInPwdManager = req.body.storedInPwdManager === "on" ? true : false;
    req.body.mfaPresent = req.body.mfaPresent === "on" ? true : false;
    req.body.pwnedStatus = req.body.pwnedStatus === "on" ? true : false;

    const currentIdentity = await Identity.findById(req.params.identityId);
    if (currentIdentity.owner.equals(req.session.user._id)) {
      await currentIdentity.updateOne(req.body);
      res.redirect("/identities");
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    res.redirect("/");
  }
});

module.exports = router;