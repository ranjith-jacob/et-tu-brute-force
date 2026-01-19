const mongoose = require("mongoose");

const identitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: true
    },
    pwdReused: {
        type: Boolean,
        required: true
    },
    storedInPwdManager: {
        type: Boolean,
        required: true
    },
    mfaPresent: {
        type: Boolean,
        required: true
    },
    pwdStrength: { // dropdown menu to be added in ejs, along with paragraph
        type: String,
        required: true
    },
    pwnedStatus: { // direct to haveibeenpwned for manual check
        type: Boolean,
        required: true
    },
    notes: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Identity = mongoose.model("Identity", identitySchema);

module.exports = Identity;