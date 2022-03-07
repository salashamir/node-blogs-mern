// require express
const express = require("express");
// controllers
const blogController = require("../controllers/blogController");

// create new express router; creates new instance of router object
const router = express.Router();

// blog routes
// attach request handlers to the router instead of app
router.get("/", blogController.blog_index);
// post handler
router.post("/", blogController.blog_create_post);
// blogs/create get route has to go first
router.get("/create", blogController.blog_create_get);
// get indidivual blog: colon in front of route param
router.get("/:id", blogController.blog_details);
// handler for delete request
router.delete("/:id", blogController.blog_delete);

// export router
module.exports = router;
