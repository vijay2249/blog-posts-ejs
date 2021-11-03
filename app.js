const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash')
const ejs = require("ejs");
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.CLUSTER_CODE}.mongodb.net/${process.env.DATABASE_NAME}`)

const homeStartingContent = "home page content";
const aboutContent = "about page content";
const contactContent = "contact page content";

const parsingData = {
  startContent: '',
  posts: []
}

app.get("/", (request,response)=>{
  response.render("home", {startContent: homeStartingContent, data: parsingData})
})

app.get("/about", (request,response)=>{
  response.render("about", {startContent: aboutContent})
})

app.get("/contact", (request,response)=>{
  response.render("contact", {startContent: contactContent})
})

app.get("/compose", (request, response)=>{
  response.render("compose")
})

app.post("/compose", (request, response)=>{
  let new_post = {
    title: request.body.title,
    content: request.body.content
  }
  parsingData.posts.push(new_post)
  response.redirect("/")
})

app.get('/posts', (request, response)=>{
  response.render("post", {data:parsingData})
})

app.get("/posts/:postTitle", (request, response)=>{
  let postTitle = _.lowerCase(request.params.postTitle)
  let post = parsingData.posts.filter(post => postTitle === _.lowerCase(post.title))
  if(post.length === 0)response.render('404')
  else response.render('post', {data: post})
})

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
