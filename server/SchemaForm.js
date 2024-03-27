const mongoose=require('mongoose');

const FormSchema=new mongoose.Schema({

    username:String,
    email:String,
    password:String
}
);

module.exports=mongoose.model('forms',FormSchema);
/*Here we are exporting the module, which then recieved by the api file to perform crud */
/*So, when you import this file into another module using require, you effectively get a Mongoose model that you can use to interact with the MongoDB collection named 'forms'.  */

/*



This code defines a MongoDB data model using Mongoose, which is an Object Data Modeling (ODM) library for MongoDB and Node.js. Let's break down the code:

Require Mongoose: const mongoose = require('mongoose');

This line imports the Mongoose library, which provides a way to interact with MongoDB using JavaScript.
Define a Schema: const FormSchema = new mongoose.Schema();

A schema is a blueprint that defines the structure of documents within a collection in MongoDB. In this case, the schema is named FormSchema.
The schema specifies that documents in the MongoDB collection will have three fields: username, email, and password. Each field is of type String.
Create a Model: module.exports = mongoose.model('forms', FormSchema);

This line creates a Mongoose model using the schema. A model is a constructor function that has methods for interacting with the MongoDB collection.
The mongoose.model function takes two arguments: the name of the collection ('forms' in this case) and the schema (FormSchema).
The resulting model is then exported, making it available for use in other parts of your application.
In summary, this code sets up a Mongoose schema for a form with fields for username, email, and password. The schema is then used to create a Mongoose model named 'forms', 
which can be used to perform operations on the MongoDB collection associated with forms, such as inserting, updating, or querying documents. This is a common pattern in Node.js applications using MongoDB to define and interact with data models.






*/