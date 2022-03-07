// http module: core module for creating server
const http = require("http");
const fs = require("fs");
const _ = require("lodash");
// create server
// instance of server can be stored in vairable, to be used in future for websockets
// createserver method on http instance takes in callback function that runs every time a request comes in to server
// acces to 2 diff objects in params: request object, and response object; url in request obejct, request type, etc
// response object we use to send response to user in browser
const server = http.createServer((req, res) => {
  // lodash
  const num = _.random(0, 20);
  console.log(num);

  const greet = _.once(() => {
    console.log("hello");
  });

  greet();
  greet();
  // set header content type being sent back to browser
  res.setHeader("Content-Type", "text/html");

  // path will always begin with this
  let path = "./views/";
  // switch statement to cycle thru cases
  switch (req.url) {
    case "/":
      path += "index.html";
      res.statusCode = 200;
      break;
    case "/about":
      path += "about.html";
      res.statusCode = 200;
      break;
    case "/about-me":
      // redirect
      res.statusCode = 301;
      res.setHeader("Location", "/about");
      res.end();
      break;
    default:
      path += "404.html";
      res.statusCode = 404;
      break;
  }

  // send an html file
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      // res.write(data);
      res.end(data);
    }
  });
});

// to actively listen to requests
// pass in port number as arg to lsiten to, plus second arg host name, default is localhost, third: callback to fire when we start listening to requests
server.listen(3000, "localhost", () => {
  console.log("listening for requests on port 3000 ");
});

// localhost and port numbers:
// localhost is liek a domain name on the web, but takes us to a very specific ip address called loopback ip address: 127.0.01, points back to ur own computer
// when we connect to locahost domain in browser, browser is connecting back to our own computer acting as a host for our website
// hostname localhost means listen for qrequests comingt to our own computer:

// port number represents a specific channel or port on our computer that a piece of software or server should communicate thru
// like doors into a computer
// doors thru which internert communcaitions can be made to different programs
// our server also needs its own port number to communciate thru: common nubmer for web development is 3000
// localhost:3000 - browser knows to connect to our own comuter via this particular port number where our server will be listenting

// status codes:
// status codes describe the type of resposne sent to the browser
// ex. 200 -OK, 301 -Resource mvoed, 404 - not found, 500 - internal server error
//  100 range - informatinoal responses, 200 range - success codes, 300range - codes for redirects, 400 range - user or client error codes, 500 range - server error codes
