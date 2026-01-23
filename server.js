const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const authController = require("./controllers/auth.js");
const identitiesController = require("./controllers/identities");

const port = process.env.PORT ? process.env.PORT : "3000";

const path = require("path");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));

app.use(passUserToView);

app.get("/", (req, res) => {
    res.render("index.ejs", {
        user: req.session.user
    });
});

app.use("/auth", authController);
app.use("/identities", isSignedIn, identitiesController);

app.get("/*path", (req, res) => {
    res.render("error.ejs", {
        msg: "Page not found!"
    });
});

app.listen(port, () => {});