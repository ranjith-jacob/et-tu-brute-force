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
        required: true,
        default: false
    },
    storedInPwdManager: {
        type: Boolean,
        required: true,
        default: false
    },
    mfaPresent: {
        type: Boolean,
        required: true,
        default: false
    },
    pwdStrength: {
        type: String,
        required: true
    },
    pwnedStatus: {
        type: Boolean,
        required: true,
        default: false
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