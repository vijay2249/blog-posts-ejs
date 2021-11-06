require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash')
const ejs = require("ejs");
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoDB connection using env and dotenv module
try{
  mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER_CODE}.mongodb.net/${process.env.DATABASE_NAME}`)
  console.log("Connection to mongoDB success");
}catch(err){
  console.log("Connection to mongoDB database Failed");
  console.log(err);
}

const postSchema = {
  title: {
    type: String,
    required: [true, "Title is Required"]
  },
  content: {
    type: String,
    required: [true, "Content is Required"]
  }
}

const blogPostModel = mongoose.model("blog", postSchema)

const homeStartingContent = "home page content";
const aboutContent = "about page content";
const contactContent = "contact page content";

const parsingData = {
  startContent: '',
  posts: []
}

app.get("/", async (request,response)=>{
  await blogPostModel.find({}, async (err, result)=>{
    if(err){
      response.render("404", {message: "Server busy try again later"});
    }else{
      parsingData.startContent = homeStartingContent
      parsingData.posts = result
      response.render("home", {data: parsingData})
    }
  }).clone()
})

// app.get("/compose", (request, response)=>{
//   response.render("compose")
// })

// app.post("/compose", async (request, response)=>{
//   new_title = request.body.title
//   new_content = request.body.content
//   try{
//     await new blogPostModel({title: new_title, content: new_content}).save()
//     response.redirect("/")
//   }catch(err){
//     console.log(err);
//     response.redirect("/compose")
//   }
// })

app.route("/compose")
  .get((request, response)=>{
    response.render("compose")
  })
  .post(async (request, response)=>{
    const new_title = request.body.title
    const new_content = request.body.content
    if(new_title === '' || new_content === ''){
      response.render("404", {message: "validation failed try again"})
    }
    else{
      await new blogPostModel({title: new_title, content: new_content}).save(function(err){
        if(err){
          response.render("404", {message: "validation failed"})
        }else response .redirect("/")
      })
    }
  })

app.get("/about", (request,response)=>{
  response.render("about", {startContent: aboutContent})
})

app.get("/contact", (request,response)=>{
  response.render("contact", {startContent: contactContent})
})

app.get("/posts/:postId", async (request, response)=>{
  let postId = request.params.postId
  await blogPostModel.findOne({_id: postId}, async (err, result)=>{
    if(err){
      // console.log(err);
      response.render("404")
    }else{
      response.render("post", {data: result})
    }
  }).clone()
})

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
