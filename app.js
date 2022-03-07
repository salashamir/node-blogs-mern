// require expressl this returns a function stored in express
const express = require("express");
const morgan = require("morgan");
// mongoose
const mongoose = require("mongoose");
// router
const blogRoutes = require("./routes/blogRoutes");
// dotenv
require("dotenv").config();

const port = process.env.PORT || 5000;

// set up express app; create instance of express appa nd store in const
const app = express();

// db: conncet to mongodb
const dbURI = process.env.MONGODB_URI;
// second arg is options obejct optional
// remember: connecting to db is an async task
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // we only want to be listening to requests if our connection is successful, remeber homepage wil display blogs fecthed from db collection
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
// callback will fire after db connction complete

// register template/view enginer; set method lets us configure aplication settings, one of the settings is view engine used ; automatically express and ejs will look for them in views folder automatically; u need to tell express if a nother folder used
app.set("view engine", "ejs");
// app.set('views', 'myviews')

// listen for requests; automatically infers we want to use localhost; also returns us instance of server, we could use it later on stored ina  variable for websockets, but we weont here
// app.listen(3000);

// middleware and static files (css, images, to be made public)
// set up static files, pass in folder name that will contain all of our static files to be made available to the front end
app.use(express.static("public"));
// takes all the url encoded data and pass tat into bjectw e can use on request object
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// custom middleware to log details to console for every request:
// app.use((req, res, next) => {
//   console.log("New request made:");
//   console.log("Host: ", req.hostname);
//   console.log("path: ", req.path);
//   console.log("Method: ", req.method);
//   // we're nto sending response to browser in this middlware, jsut move onto next
//   next();
// });
// we have to explicitly tell it to move on to the next middleware; use next function which we have access to in params
// app.use((req, res, next) => {
//   console.log("In the next middleware");
//   next();
// });

// mongoose and mongo sandbox routes: SANDBOX, JSUT FOR LEARNING
// app.get("/add-blog", (req, res) => {
//   // create new instnace of blog model
//   const blog = new Blog({
//     title: "New Blog 2",
//     snippet: "about my new blog",
//     body: "more about my new blog",
//   });
//   // save to db, will look for "blogs" colleciton: async task
//   blog
//     .save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.get("/all-blogs", (req, res) => {
//   // method to get all from collection blogs; is async
//   // method DIRECTLY on Blog, not on an instance of the Blog as we did with add
//   Blog.find()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => console.log(err));
// });

// app.get("/single-blog", (req, res) => {
//   Blog.findById("62243de5e61403356f28b448")
//     .then((result) => res.send(result))
//     .catch((err) => {
//       console.log(err);
//     });
// });

// routes
// respond to requests, get request: callback function called when request sent, params automaticlly take in request and response objects
app.get("/", (req, res) => {
  // express method we can use; it infers type of content we want to send to borwser and automatically sets content headers; also infers the status code! in some cases we still want to manually set
  // res.send("<p>Home page.</p>");
  // will look for absolute path bydefault, second arg is options object specifiying what root should be
  // res.sendFile("./views/index.html", { root: __dirname });
  // render a view
  // res.render("index", { title: "Home", blogs });
  //redirect:
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  // res.send("<p>About page.</p>");
  res.render("about", { title: "About" });
});

// blog routes
app.use("/blogs", blogRoutes);

// 404 page
// use method used to create middleware and fire middlware functions
// not scoped toa  particular url, why it needs to be last in order so only reached if above theres no match
app.use((req, res) => {
  // we also have to manually set 404 error status code here
  // status method returns response object itself w status coded so we can tack on senfile method
  // res.status(404).sendFile("./views/404.html", { root: __dirname });
  res.status(404).render("404", { title: "404" });
});
// use function wil fire for ervery request coming in only if request reaches this point in code; express iwll run through our code top to bttom and wll fire callback of get method if finds match, will no longer carry on down the rest of the code
// will fire this use method if none of above match

// ejs templates:
// our ejs view files liev on the server. the ejs templates are processed through ejs view enginer on the server
// when we ewant to render one to the browser, its passed thru the enginer and the engine looks for any dynamic content and js logic and figures out the html code for those parts and spits out valid html page wdata for the template we wrote. this whole process is called SERVER SIDE RENDERING.

// Partials:
// all of our views have the same nav. not efficient and we'd have to change in every file if our nav links changed.would be nice to create a file which holds this part of template which is the same and we can import it into our views... we only have to update 1 file instead of individual views. these files are called PARTIAL TEMPLATES: parts of a template that can be reused in different views

// Middleware:
// code which runs on the server between getting a request and sending a response
// use method generally used to run some middleware callback function with logic/code; app.use(func)
// u can have more than just one middleware
// function that run in our get handlers are essentially middleware as well
// difference: get handlers fire functions only for get reqeusts for a certain route; whereas use callback functions run for every type of request for all routes
// middleware runs from top to bottom in our code, runs until we exit the process or explicitly send reponse to browser
// order of mdidleware very important to how it runs; if u send a '/' request you cant have any middleware or use method after the app.get('/', func) runs because that returns the reponse
// weve already been using middleware a lot when handling route handler functions and 404 errors with the use method

// middleware examples: logger middleware to log details of every request, authentication check middleware for protected routes, middleware to parse JSON data from requests, return 404 pages

// express alrady comes w a bunch of custom middleware like morgan for logging, helmet for security etc., middleware for using sessions, cookies, validation... dont write everything from scratch, just use a 3rd party package: install morgan w npm for logging

// static files: if we add static files to our projects i.e. images or css files, we cant access them automatically from the browser/frontend. we cant do /styles.css.. so if we cant access them from the browser, even if we place link to them in our templates we still cant acess them,, even with a link with an href to the styles.css... wont work

// server protects all of our files automatically from users in a browser... to allow the browser acess we have to specify what files should be public, allowed to be accessed... we can use readymade middleware that comes w express to tdo this called static middleware

// anything placed int he public folder will be accessible at the root level from our browser.. so you can do /styles.css, not /public/styles.css
// all achieved by using the static middleware in express

// NOSQL vs SQL
// SQL- TABLES, ROWS, COLUMNS
// NoSQL - COLLECTIONS, SDOCUMENTS,
// mongodb is nosql database
// nosql databases have collections which are like tables, each collcetion is used to store a particular type of data ro records/documents. maybe a collcetion for users, one for blog documents, each collction contains only one type of document. we will store blog documents:
// document like a record in sql representing a single datum:
// docs like json objects with key, value pairs:
// they also get autogenerated unique ids
// from our serverside code we connect to a colection in a db and we can read, update, delete, create new documents
//  we can install mongodb locally on our comp, our use a clodu database already hosted for us.. easier, like mongodbatlas

// using mongdodb api is complicated and clunky verbose, instead install and use mongoose to do your database queries.. much easier!

// MONGOOSE, MODELS, SCHEMA
// mongoose is an ODM library - OBJECT DOCUMENT MAPPING LIBRARY,
//  wraps the standard mongodb api and provides us w much easier way to connext to and communciatew db, allows us to create simple data models with db query methods to create, udpate, get, delete, database docs
// queries the correct db collction for us based ont he name of the model we use, performs aaction required, and returns us a reponse

// SCHEMAS AND MODELS
// schemas define the structure of a type of data/document
// -properties and prtoperty types ex:
// USER schema:
// name (string), required
// age (number)
// bio (string), required
//
// next, we create MODEL based on that schema:
// models allow us to communicate with database collections
// create blog model based on blog shcema, will have both static and instance methods which we can use to save, update, read data from blogs collection

// REQUEST TYPES:
// GET requests, typically to get a resource from the server (app.get()), a webpage, JSON data from a db, there are other types of requests..
// POST requests to create new data in oru database
// DELETE requests to delete data, eg. delete a blog
// PUT requests to update existing data

// localhost:3000/blogs - GET request sent from browser to server
// localhost:3000/blogs/create - GET request, gets us webpage with form
// we also need routes to interact w our data in other other ways, xeample one to add a new blog deocument to db after we fill out form and clcik submit..
// localhost:3000/blogs - sameroute???? fine, we can use same routes for different types of requests, WELL USE POST REQUEST on this route..

// WE CAN USE SAME ROUTES FOR DIFF REQUESTS.. THE DIFF REQUESTS WILL BE HANDLED DIFFERENTLY ON OUR SERVER!
// we also need a route item to get a single blog item;
// localhost:3000/blogs/:id where id changes depdndent on blog -GET
// localhost:3000/blogs/:id - DELETE, we'll handle it differently

// also we can have routes for updating blogs.. PUT request

// basic route structure for CRUD website, for every different data type or resource (blogs, users, books, authors).. will look similar to this tructure of urls and types of requests

// ROUTE PARAMETERS
// the avariable parts of the route that may change value
// :id in localhost:3000/blogs/:id

// EXPRESS ROUTER:
// comes fulyl baked into express, USE IT to manage routes more efficiently as project grows
// we split our routes into different files and manage them in small groups routes that belong together. makes app more modular.

// MVC
// to make our code more organizd, maintainable we splti large program into separate sections:
// model - handles the requests coming into the server, handles request flow, acts as a middleman between the modela nd view and shoudlnt comtain much code
// firs tting that happens when controller receives request is it asks the model for info based ont the request..
// model- interacts w database and handles all validation, saving, updating, deleting, etc of the data; HOW WE DSCRIBE OUR DATA AND USE THEM TO INTERACT W DATABASE
// moedl reposnible for handling all data logic
// CONTROLLER NEVER DIRECTLY INTERACTS W THE DATA LOGIC, USES MODEL TO PEROFMR THESE INTERACTIONS.. CONTROLLER NEVER HAS TO WORRY ABOUT HANDLING THE DATA IT SENDS AND RECEIVES
// MODEL never has tow orry about handlign user requests and what to do on failure or success... thats controller... model only cares about ineteracting w data
// cntroller intercts w view to render data to user
// VIEW ONLY CONCERNED WITH RENDERING DATA TO DISPLAY

// MODEL sends reponse back to CONTROLLER, then CONTROLLER needs to interact w the VIEW to render the data tot he user:
// VIEW ONLY CONCERNED W PRESENTING INFORMATIONC ONTROLELR SENDS IT - VIEW WILL BE A TEMPLATE FILE THAT DYNAMICALLY RENDERS HTML BASED ON DATA CONTROLELRS SENDS IT
// view does nto worry about how to handle final presentation of data, but only how to present it... VIEW sends final presenration back to controller AND CONTROLLER HANDLES SENDING THAT PRESENTATION BACK TO USER!

// MODEL AND THE VIEW NEVER INTERACT WITH EACH OTHER. CONTROLLER IS MIDDLEMAN. PRESENTATION OF DATA AND LOGIC OF DATAR ARE COMPLETELY SEPEARATED.. MAKING APPS EASIER!

// WITH route, model, view, controllers folders and js files for each resource OUR PROJECT IS MUCH MORE MODULAR AND ORGANIZED NOW!

// NOW OUR code is structured in maintainable, logical way. we'd follow same pattern for every new type of resource and set of routes wed follow this pattern with routes file, model for the data, and controller for handlers, and folder for views as well.
