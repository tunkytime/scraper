const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = app => {
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/scrape", (req, res) => {
    axios.get("https://www.nytimes.com/section/technology").then(response => {
      console.log(response);
      const $ = cheerio.load(response.data);

      $("article div").each(function(i, element) {
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
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(err => {
            console.log(err);
          });
      });
      res.send(
        `<h1>Scrape complete.</h1>
        <a href="/articles">View results here</a>`
      );
    });
  });

  app.get("/articles", (req, res) => {
    db.Article.find({})
      .populate("comment")
      .then(dbArticle => {
        // res.json(dbArticle);
        res.render("articles", {
          article: dbArticle
        });
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.get("/articles/:id", function(req, res) {
    db.Article.find({
      _id: req.params.id
    })
      .populate("comment")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { comment: dbComment._id } },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.delete("/articles/:id", function(req, res) {
    db.Comment.remove({ _id: req.params.id })
      .then(function(dbComment) {
        res.end("Deleted");
      })
      .catch(err => {
        res.json(err);
      });
  });
};
