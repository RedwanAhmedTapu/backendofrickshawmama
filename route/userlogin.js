const { User, Verification } = require("../models/register.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userLog = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({
      email: email,
    })
      .exec()
      .then((user) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error("Error comparing passwords:", err.message);
            res.status(404).json({ message: "Error comparing passwords" });
          }

          if (isMatch) {
            const token = jwt.sign({ email }, process.env.JWT_SECRETKEY, {
              expiresIn: "1h",
            });

            // Return the token to the client

            res.status(200).json({ user, token });
          } else {
            // Passwords do not match
            res.status(200).json({ message: "not any user" });
          }
        });
      })
      .catch((err) => {
        res.status(404).json({ message: "err" });
      });

  
      await User.findOneAndUpdate({ email }, { $set: { isLoggedin: true } });
    
  } catch {
    res.status(404).json({ message: "errorr" });
  }
};
module.exports = userLog;
