const express = require("express");
const exphbs = require('express-handlebars')
const mongoose = require("mongoose");
const axiox = require("axios");
const cheerio = require("cheerio");

// const db = require("./models");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.static("public"));

app.set('views', './views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

require("./routes/htmlRoutes")(app);

app.listen(PORT, function () {
    console.log(
        "Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});