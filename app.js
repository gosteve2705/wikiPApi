//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});


const wikiSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('article', wikiSchema);

app.route("/articles")
.get(function(req, res) {
  Article.find({},function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }

  });
})
.post(function (req,res){

  const newArticle = new Article({
  title:  _.capitalize(req.body.title),
  content: req.body.content
  });

  newArticle.save(
    function(err){
      if(!err){
        res.send('successfully added new article');
      }else{
        res.send(err);
      }
    }
  );
  res.redirect('/articles');
})
.delete(function (req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted all the articles");
    }else{
      res.send(err);
    }
  });
});


app.route("/articles/:title")
.get(function(req,res){
  Article.findOne({title: _.capitalize(req.params.title) }, function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article matching that title was found");
    }
  });
})
.put(function(req,res){
  Article.update(
    {title: _.capitalize(req.params.title) },
    {title: _.capitalize(req.body.title), content: req.body.content},
    {overwrite:true},
    function(err){
      if (!err){
        res.send('successfully updated the article');
      }
    }
  );
})
.patch(function(req,res){
  Article.update(
    {title:_.capitalize(req.params.title)},
    {$set :req.body},
    function(err){
      if(!err){
        res.send("successfully updated the article");
      }else{
        res.send(err);
      }
    }
  );
})
.delete(function(req,res){
  Article.deleteOne({title:_.capitalize(req.params.title)},
  function(err){
    if(!err){
      res.send("successfully deleted the article");
    }else{
      res.send(err);
    }
  }
);}
);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
