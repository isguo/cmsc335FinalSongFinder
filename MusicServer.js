const express = require("express");
const app = express();
const path = require("path");
const portNumber = 7003;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// comment out for Render
// require("dotenv").config({
//    path: path.resolve(__dirname, "credentialsDontPost/.env"),
// });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log("Connected to MongoDB via Mongoose");

        const searchRoutes = require("./routes/search");
        const favoritesRoutes = require("./routes/favorites");

        app.use("/", searchRoutes);
        app.use("/favorites", favoritesRoutes);

        app.listen(portNumber, () => {
            console.log(`main URL http://localhost:${portNumber}/`);
        });

    } catch (err) {
        console.error("Error starting the app: ", err);
    }
})();