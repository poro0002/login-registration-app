// This whole file is intermediary between your client-side application (e.g., HTML, CSS, JavaScript) and your MongoDB database, 
// it acts as an API.

const express = require("express");
const User = require('./schema.js');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const jwt_key = process.env.JWT_KEY;
const port = process.env.PORT;
app.use(cors());

const uri = "mongodb+srv://kieranporopat:nexyfbaby@kiirynn1.zkkwygc.mongodb.net/Node-API?retryWrites=true&w=majority&appName=kiirynn1";
const mongoose = require('mongoose');

mongoose.connect(uri)
  .then(() => console.log('Connected to mongoDB!'))
  .catch(err => {
    console.log('error to mongoDB!', err)
  })



  app.listen(port, (err) => {
    if(err){
       console.log("server error", err);
       return
    }
    console.log(`listening on port ${port}`)
});



app.get('/', (req, res) => {
  //checks health

   res.status(200).send({code: 0, message: "ok"})
});



app.get('/token', (req, res) =>{
    // gives the client a token
    let id = Math.random().toString(36).substring(2, 8)
    let limit = 60 * 310000;
    let expiry = Math.floor(Date.now() / 1000 ) + limit;
    let payload ={
        _id : id, 
        exp: expiry
    }
    let token = jwt.sign(payload, jwt_key)
    res.status(201).send({data: token});
});

// so pretty much this test code just creates one if there hasnt been one mde already, or it just tests it to see if its invalid

app.get('/test', (req, res) =>{
    // you need a token to access or verified
    const header = req.header('Authorization');
    const [type, token] = header.split(" ");

    // this if else checks if the token is present before verifying it 
    if(type === 'Bearer' && typeof token !== 'undefined'){
        try{
          let payload =  jwt.verify(token, jwt_key);
          let currentTimeStamp = Math.floor(Date.now() / 1000);
          let diff = currentTimeStamp - payload.exp;
          res.status(200).send({code: 0, message: `all good. ${diff} remaining`})
        }catch(err){
            res.status(401).send({code: 123, message: "Invalid or expired Token"})
        }
    }else{
        res.status(401).send({code: 456, message: "Invalid Token"})
    }
});

app.use(express.json());

// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
// The .save() method is provided by Mongoose to save to the database
// We make this asynchronous because it allows the rest of the code in our script to fire while we process the user data

app.post('/register', async (req, res) => {
                   
    try {
          const existingUser = await User.findOne({username: req.body.username}) 
          const existingEmail = await User.findOne({email: req.body.email}) 
          const existingPhone = await User.findOne({phone: req.body.phone}) 

          if(existingUser){
            return res.status(400).json({error: "username is taken"})
          } 
          else if(existingEmail){
            return res.status(400).json({error: "There is an account associated with this email already"})
          }
          else if(existingPhone){
            return res.status(400).json({error: "There is an account associated with this phone number already"})

          }
            console.log('User data:', req.body);
            let newUser = await User.create(req.body);
            res.status(201).json(newUser);
        
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
});


app.post('/login', async (req, res) => {
    try{
        const reqUser = req.body.username;
        const reqPass = req.body.pass;
        

        // Find user in the database that matches the client reqUser value
        const user = await User.findOne({username: reqUser});
        console.log(user)

        // if it makes it past this the user exists
        if (!user) {
            console.log('User not found')
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("user found");

        //it then goes on to check if the password in that specific user data matches 
        if (user.pass === reqPass ) {
            console.log(`Successful login. Welcome ${user.username}`);
            return res.status(200).json({ message: 'Login successful' });
        } else { // if it doesnt it denies the attempt
            console.log('Incorrect password');
            return res.status(401).json({ message: 'Incorrect password' });
        }

       
    }catch{
        res.status(500).json({ message: "something went wrong"  });
    }
})

// Define a route for searching users
// essentially this sends a request to the mongo DB database
app.get('/search', async (req, res) => {
    try {
        // Perform a query to find users in the database
        const users = await User.find(req.query);
        // console.log(users)

        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






