const express = require('express');
const router = express.Router();
const User = require('../model/User.js');
const jwt = require('jsonwebtoken') 
const Cards = require('../model/Card.js')
const jwtSecret = require('../config/config.js').jwtSecret;



console.log('Generated Secret Key:', jwtSecret);


// Signup route
router.get('/signup', (req,res)=>{
    res.send("hello from sign up")
})

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, dob, phone } = req.body;
    
    // Check if the user already exists in the database by email
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // User already exists, return an error response
      return res.status(400).json({ error: 'User already registered' });
    }

    // Create a new user using the User model
    const user = new User({
      name,
      email,
      password, // Ensure to hash the password before saving (not shown in this code)
      dob,
      phone,
    });
    
    // Save the user to the database
    await user.save();

    res.status(202).json({ message: 'User registered successfully' , name: user.name});
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPassword = req.body.password === user.password;
    if (!validPassword) {
      return res.status(400).json("Password incorrect");
    }

    // Create a payload for the JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        // Include the 'role' field for admin users
        role: user.email === "umair@gmail.com" ? "admin" : "regular",
      },
    };

    // Sign the JWT token with a secret key
    jwt.sign(
      payload,
      jwtSecret, // Use the hardcoded secret key
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to generate token' });
        }

        if (user.email === "umair@gmail.com") {
          // User is an admin, you can return a special role or flag
          return res.status(202).json({

            message: "Welcome admin",
            role: "admin",
            user: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: token, // Send the generated token to the client
          });
        }

        // Regular user
        res.status(202).json({
          role:"regular",
          message: "Welcome",
          name: user.name,
          user:user.id,
          email: user.email,
          phone: user.phone,
          token: token, // Send the generated token to the client
        });
      }
    );
  } catch (err) {
    return res.status(555).json("Error finding user");
  }
});

// Route for saving cards from the admin site 
router.post('/admin', async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const card = new Cards({
      title,
      description,
      price,
    });

    await card.save();
    res.status(201).json({ message: "Successfully added card in db", card });
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
