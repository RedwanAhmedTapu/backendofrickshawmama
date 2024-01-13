const { User, Verification } = require("../models/register.model");

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  console.log("verification" + "  " + `${code}`);
  console.log(req.body);
  try {
    const verification = await Verification.findOne({
      email,
      code,
    })
      .then((veriFiedUser) => {
        return veriFiedUser;
        console.log(veriFiedUser);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
    console.log(verification);
    if (!verification) {
      const user = await User.findOne({ email });
      if (!user.isVerified) {
        await User.deleteOne({ email });
      }
      return res.status(400).json({ message: "Invalid verification code" });
    }

    await User.findOneAndUpdate({ email }, { $set: { isVerified: true } });


    await Verification.deleteOne({ email, code });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
};
module.exports = verifyEmail;
