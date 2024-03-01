const Contact=require("../models/contact.model");



const contact=async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      // Create a new contact document
      const contact = new Contact({
        name,
        email,
        message
      });
  
      // Save the contact document to the database
      await contact.save();
  
      res.status(201).json({ message: 'Contact form submitted successfully!' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({ error: 'Failed to submit contact form' });
    }
}

module.exports=contact;