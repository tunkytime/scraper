const express = require("express");
const exphbs = require('express-handlebars')
const mongoose = require("mongoose");

const db = require("./models");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

app.set('views', './views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes
require("./routes/htmlRoutes")(app);

app.listen(PORT, () => {
    console.log(
        "Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});