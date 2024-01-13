const { User, Verification } = require("../models/register.model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
 
  auth: {
    user: "redwantapu1234@gmail.com",
    pass: "iyeg grqz gptq jsnb",
  },
});

const registration = async (req, res) => {
  console.log(req.body);
  try {
    const { fname, lname, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    const userData = await User.findOne({ email: email })
      .exec()
      .then((user) => {
        if (user) {
          res.send({message:"user already exist"});
        } else {
          const newUser = new User({
            fname,
            lname,
            email,
            password: hashpassword,
          });
          newUser.save();

          const verificationCode = randomstring.generate(6);
          const newVerification = new Verification({
            email,
            code: verificationCode,
          });
          newVerification.save();

          const mailOptions = {
            from: 'redwantapu1234@gmail.com',
            to: email,
            subject: "Email Verification Code",
            text: ` verification code is: ${verificationCode}`,
          };
          transporter.sendMail(mailOptions);

          res.send({message:"successfully studentInfo saved"});
          // res.redirect('/login');
        }
      })
      .catch((err) => {
        res.status(404).send("err");
      });
  } catch (error) {
    res.status(404).send("error");
  }
};
module.exports = registration;
