// blog model from mongoose
const Blog = require("../models/blog");
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

const blog_index = (req, res) => {
  Blog.find()
    // -1 is descending order
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("blogs/index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => console.log(err));
};

const blog_details = (req, res) => {
  // extract id from request object
  const id = req.params.id;
  console.log(id);
  // retrieve doc with that id from the db
  Blog.findById(id)
    .then((result) => {
      // result will be single blog based on id
      res.render("blogs/details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "Blog not found 😭" });
    });
};

const blog_create_get = (req, res) => {
  res.render("blogs/create", { title: "Create a New Blog" });
};

const blog_create_post = (req, res) => {
  // middleware that will parse the data we send in the form into a workable format and attach it to the request object
  // create new instance of blog
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      // redirect to home
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
};

const blog_delete = (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      // we cannot use redirect in node when we wsent request via ajax front end code in our js script
      // we  send json object response to browser, then redirect browser to url passed in objcet
      // remember res here means response from the app callback in delete
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
};
