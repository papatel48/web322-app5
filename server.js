/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Pranav Patel
 *  Student ID: 119945212  
 *  Date: 30/09/2022
 *
 *  Online (Cyclic) Link: 
 *
 ********************************************************************************/


 var express = require("express");
 var app = express();
 var path = require("path");
 var blog_service = require("./blog-service.js");
 const exphbs = require('express-handlebars');
 const bodyParser = require('body-parser');
 
 var HTTP_PORT = process.env.PORT || 8080;
 
 function onHttpStart() {
     console.log("Express http server listening on: " + HTTP_PORT);
     return new Promise((res, req) => {
         blog_service.initialize().then((data) => {
             console.log(data)
         }).catch((err) => {
             console.log(err);
         });
     });
 }
 
 
 app.get("/", function(req,res){
   res.redirect("/about");
 });
 
 
 
 app.use(express.static('public')); 
 app.use(bodyParser.urlencoded({ extended: true }));
 app.engine(".hbs", exphbs.engine({
     extname: ".hbs",
     defaultLayout: 'layout',
     helpers: {
         equal: (lvalue, rvalue, options) => {
             if (arguments.length < 3)
                 throw new Error("Handlebars Helper equal needs 2 parameters");
             if (lvalue != rvalue) {
                 return options.inverse(this);
             } else {
                 return options.fn(this);
             }
         }
     }
 }));
 app.set("view engine", ".hbs");
 
 
 app.get("/about", function(req,res){
   res.sendFile(path.join(__dirname, "/views/about.html"));
 });
 
 
 
 
 app.get("/categories", (req, res) => {
   blog_service.getCategories().then((data) => {
       res.json(data);
       
   }).catch((err) => {
       res.json({ message: err });
   });
 });
 
 
 app.get("/posts", (req, res) => {
   blog_service.getAllPosts().then((data) => {
       res.json(data);
       
   }).catch((err) => {
       res.json({ message: err });
   });
 });
 
 
 // setup http server to listen on HTTP_PORT
 app.listen(HTTP_PORT, onHttpStart);