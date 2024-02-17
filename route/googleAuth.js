const { OAuth2Client } = require('google-auth-library');
const { User } = require("../models/register.model");

const client = new OAuth2Client('937173192475-srjkndb4hln721ut5f40m08d3u6e0tq2.apps.googleusercontent.com'); // Replace with your actual Google OAuth client ID

const googleAuthentication = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token);
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '937173192475-srjkndb4hln721ut5f40m08d3u6e0tq2.apps.googleusercontent.com', // Replace with your actual Google OAuth client ID
    });
    
    const { given_name, family_name, email } = ticket.getPayload();

    // Check if the user already exists in your database
    let user = await User.findOne({ email });

    if (user) {
      // If the user already exists, you can proceed with your authentication logic
      res.send({ message: "user already exist" });
    } else {
      // If the user doesn't exist, create a new user with the provided information
      const newUser = new User({
        fname: given_name,
        lname: family_name,
        email,
      });
      await newUser.save();
      
      // Update the user's login status (optional)
      await User.findOneAndUpdate({ email }, { $set: { isLoggedin: true } });

      // Send a success response
      res.send({ message: "User created successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = googleAuthentication;
