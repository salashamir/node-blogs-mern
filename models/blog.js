const mongoose = require("mongoose");

// get schema from mongoose package
// will define the structure of the docs we will later store in colelction; thing that a model wraps around
// .schema is actually a constructor function, we create new one and store it in a constant
// this returns a schema constructor
const Schema = mongoose.Schema;

// create new isnatnce of schema ojbject, need to pass in object that describes the structure of the docs we want to store in blogs collection
// second arg to schema constructor is an options object that we can use to set timestmps to true, egenrating timestamps on our blog docs
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// next thing to do: create a model based on our blog schema
// schema defines structure of our docs, model surroundeds the schema and provides us with an interface by which to communicate w a database collection for that document type

// model, conventionally capitalized
// name is important, bc will look for that collection int he database, will look for blogs collection automatically, whenever we use the Blog model.. we dont have to find it
// name should be singular of coleltion name
// second arg is schema we wan to base model on
const Blog = mongoose.model("Blog", blogSchema);

// export model
module.exports = Blog;

// BLOG SCHEMA AND MODEL CREATED@
