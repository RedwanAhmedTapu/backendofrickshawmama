const Rickshawpuller = require("../models/rickshawpuller.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userLog = async (req, res) => {
  try {
    const { nid, password } = req.body;
    const userData = await Rickshawpuller.findOne({
      nid: nid,
    })
      .exec()
      .then((user) => {
        if (!user) {
          res.status(200).json({ message: "not any user" });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error("Error comparing passwords:", err.message);
              res.status(404).json({ message: "Error comparing passwords" });
            }

            if (isMatch) {
              const token = jwt.sign({ nid }, process.env.JWT_SECRETKEY, {
                expiresIn: "1h",
              });

              // Return the token to the client
              res.status(200).json({ user, token });
            } else {
              // Passwords do not match
              res.status(200).json({ message: "not any user" });
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error finding user:", err.message);
        res.status(404).json({ message: "err" });
      });

  } catch (error) {
    console.error("Error in userLog:", error.message);
    res.status(404).json({ message: "errorr" });
  }
};

module.exports = userLog;
