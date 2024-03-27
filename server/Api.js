const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');
var nodemailer=require('nodemailer');
require('dotenv').config();
require("./Connection");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  //service:"gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "golukumar9919mish@gmail.com",
    pass: process.env.MY_PASSW,
  },
  tls:{
    rejectUnauthorized:false
  },
});



const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

cloudinary.config({
  cloud_name: 'dzw6geqqi',
  api_key: '128965351476669',
  api_secret: 'vKzF0ACjhUScXJI1fIgcYiiCgjU'
});

const Product = require('./SchemaRide');
const sign = require('./SchemaForm');// the exported collection and schema is stored in sign.if we want to perform crud in db then we need it.
const bookings=require('./BookingSchema')
const booked=require('./BookingSchema')
require("./SchemaRide");
//require("./SchemaImage");

//const photos = mongoose.model("photos");//photos is the model 

app.get('/', (req, res) => {
  res.send('server working');
});



const multer = require("multer");

const storage = multer.diskStorage({
  destination: 'uploadedImages/'
});

 const upload = multer({ storage: storage });

 app.post('/post',upload.single('image'),async function(req,res,next){
  cloudinary.uploader.upload(req.file.path, async function(err,result){
   //console.log(formData)
   if (err) {
       console.log(err);
       res.status(500).send(err);
     } else {
       console.log('File uploaded to Cloudinary');
      
       let data = new Product(req.body);
       
      console.log("data" + data)//yaha image url khali hoga
      data.imageUrl = result.secure_url; 
      console.log("data" + data)//yaha ham imageurl add kar diye
      let savedData = await data.save();
       
     res.send(savedData);
      // res.status(200).send(result);
     }

  })
 
})


app.delete("/delete/:_id", async (req, resp) => {
  let data = await Product.deleteOne(req.params);
  resp.send(data);
});




app.get("/getter", async (req, res) => {
  Product.find({}).then((data) => {
    res.send(data);
  });
});

app.get("/getbooking/:_id", async (req, res) => {
  Product.findById(req.params).then((data) => {
    res.send(data);
  });
});


app.get("/getbooked", async (req, res) => {
  booked.find({}).then((data) => {
    res.send(data);
  });
}); 

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  //the data which is being sent by signup form will be inside request body.
  //const { username, email, password } = req.body;: This line of code is using destructuring assignment in JavaScript. 
  //It's extracting specific properties (username, email, and password) from the req.body object and assigning their values to individual variables.
  //username, email, and password are variable names that will be created based on the properties found in req.body.
  const existingUser = await sign.findOne({ email:email });//first username is the field name inside schema and secondone is the data recieved from frontend side.
  //If a document with the username specified in the query criteria is found in the "sign" collection, the existingUser variable will be assigned an object representing that document.
  //sign is the name of model. using model we perform crud operations
  if (existingUser) {//objects are considerd as trruthy value
    return res.status(400).json({ message: 'Username already taken' });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);//10 is cost factor
  const newUser = new sign({ username, email, password: hashedPassword });//creating data using model

  try {
    await newUser.save();
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/bookings', async (req,res)=>{
 const {username,useremail,driverid,drivername,driverphone,pickup,pickuptime}=req.body
 const newbooking= new bookings({username,useremail, driverid,drivername,driverphone,pickup,pickuptime})

 await newbooking.save()
})


app.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  const user = await sign.findOne({ username: username, email: email });
//This query will retrieve a document from the sign collection where both the username and email fields match the specified values simultaneously.
// If such a document exists, it will be stored in the user variable.
 //findone will return the required data object or null. null is falsy whereas object is truthy.
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
 
  const isPasswordValid = await bcryptjs.compare(password, user.password);
//true or false will be returned in above variable.
  if (!isPasswordValid) { //!true=false
    return res.status(401).json({ message: 'Authentication failed' });
  }

  let token;
  if (username === "Vicky mishra"&&email==="mishravicky0141@gmail.com"&&password==="123456") {
    //generating token for admin role
    token = jwt.sign({ userId: user._id, role: 'Admin' }, 'your_secret_key', { expiresIn: '1h' });
  } else {
    //generating token for users role
    token = jwt.sign({ userId: user._id, role: 'user' }, 'your_secret_key', { expiresIn: '1h' });
  }

  res.json({ token });
//Sends a JSON response containing the generated token. This response can be consumed by the client, typically for authentication purposes
});

app.post('/mail',async (req,res)=>{

  let email=req.body.email
  let pass_email=req.body.pass_email
  let pass_name=req.body.passs_name
  let pickuppoint=req.body.pickup
  let pickuptime=req.body.pickuptime
  let drivername=req.body.drivername
  let driverphone=req.body.driverphone
 console.log("pass email",pass_email)
  const info={

    from:"golukumar9919mish@gmail.com",
    to:[email,pass_email],
    subject:"Ride Booked successfully",
    text:"DriveDosti:-a ride sharing platform",
    html: `<h1>DriveDosti booking details:-</h1>
    <img src="https://res.cloudinary.com/dzw6geqqi/image/upload/v1710793327/1_d40kdi.jpg" class="img-fluid" >
    <h4 style="color:green">Passenger details:-</h4><br></br>
        
        <p>Passenger name:-${pass_name}</p>
        <p>Passenger Email:- ${pass_email}</p>
        <p>Pickup point:-${pickuppoint}</p>
        <p>Time:-${pickuptime}<p>
        <h4 style="color:green">Dost(driver) details:-</h4>
        
        <p>Dost(driver)name:-${drivername}</p>
        <p>Dost phone no:- ${driverphone}</p>
        <p>Dost email:-${email}</p>
        `

  }

   transporter.sendMail(info,(err,result)=>{

    if(err){
          console.log(err)
    }
    else{
        console.log("mail sent successfully",info)
    }
  })
})


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});


/*

bcrypt is a widely-used library in the realm of web development and security, primarily for securely hashing and salting passwords. Its main use is to enhance the security of user authentication systems by making it computationally expensive and time-consuming for attackers to perform password cracking.
Here's why bcrypt is commonly used and its primary uses:
Password Hashing: bcrypt is used to hash passwords before storing them in a database. Hashing transforms a plain text password into a fixed-length string of characters, which cannot be easily reversed to obtain the original password.
Salting: It automatically generates and manages a random salt for each password hash. Salting is a crucial security measure because it ensures that identical passwords don't result in the same hash. Even if two users have the same password, their hashes will be different due to the unique salts. 
This helps thwart precomputed or rainbow table attacks.
*/

/*The cost factor is an exponential factor, meaning that each increment of the cost factor doubles the amount of time it takes to compute the hash.
 Therefore, a cost factor of 10 is considered a reasonable and secure choice for hashing passwords.  */

 /*Tokens:- In summary, this code generates a JWT based on the role (admin or user) determined by the username. The generated token is then sent in a JSON response to the client. 
 The role information in the token can be used by the server to make authorization decisions when the token is presented in future requests. */