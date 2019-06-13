const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = app => {
    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/scrape", (req, res) => {
        axios.get("http://www.echojs.com/").then(response => {
            const $ = cheerio.load(response.data);
            $("article").each((i, element) => {
                const result = {};

                result.headline = $(this)
                    .children("h2")
                    .children("a")
                    .text();
                result.summary = $(this)
                    .children("p")
                    .text();
                result.link = $(this)
                    .children("h2")
                    .children("a")
                    .attr("href");
                db.Article.create(result)
                    .then(dbArticle => {
                        console.log(dbArticle);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            res.send("Scrape Complete");
        });
    });

    app.get("/articles", (req, res) => {
        db.Article.find({})
            // .populate("comments")
            .then(dbArticle => {
                res.render("articles", {
                    article: dbArticle
                });
            }).catch(err => {
                res.json(err);
            });
    });

    app.get("/articles/:id", (req, res) => {
        db.Article.findOne({
            _id: req.params.id
        }).populate("comment").then(dbArticle => {
            res.json(dbArticle)
        }).catch(err => {
            res.json(err);
        });
    });

    app.post("/articles/:id", (req, res) => {
        db.Comment.create(req.body).then(dbComment => {
            res.json(dbComment);
        }).catch(err => {
            res.json(err);
        });
    });

};