const express = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/UserModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs')

const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Validate the email format
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a reset token and set expiration time
      const resetToken = uuidv4();
      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      // Create transporter using SMTP credentials
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,// TLS requires 'false'
        auth: {
          user: process.env.EMAIL_USER, // Use environment variable for email
          pass: process.env.EMAIL_PASS, // Use environment variable for password
        },
      });
  
      // Prepare email options
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to: email, // Recipient email address
        subject: 'Password Reset',
        html: `<p>Click this <a href="${process.env.URL_FRONTEND}reset-password/${resetToken}">link</a> to reset your password.</p>`,
      };
  
      // Send password reset email
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset email sent', success: true, redirect: 'http://localhost:3000'});
     
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  const updatePassword = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Generate a salt and hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Find the user by email and update the hashed password
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Password updated successfully', success: true });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

module.exports = {forgotPassword, updatePassword};
