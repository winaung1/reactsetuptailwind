const User = require('../Models/UserModel')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const getUser =  async (req, res) => {
    const user = await User.find();
    res.json(user);
  }

  const getOneUser = async (req, res) => {
    const { email } = req.params; // Extract email from request parameters
  
    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });
  
      if (!user) {
        // If user is not found, return 404 Not Found
        return res.status(404).json({ message: 'User not found' });
      }
  
      // If user is found, return user object as JSON response
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Handle internal server error
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
const updateRole = async (req, res) => {
  const { email, role } = req.body;
  
    try {
      // Find the user by email and update the role to 'admin'
      const updatedUser = await User.findOneAndUpdate({ email: email }, { role: role });
  
      if (!updatedUser) {
        // If user is not found, return a 404 Not Found response
        return res.status(404).json({ message: 'User not found' });
      }
  
      // User role updated successfully
      res.status(200).json({ message: 'User role updated to admin' });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  const updateUser = async (req, res) => {
    const { email } = req.params;
    const { username, password } = req.body; // Updated user data from request body
  
    try {
      // Generate a hashed password
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with salt rounds (e.g., 10)
  
      // Find the user by email and update the username and hashed password
      const updatedUser = await User.findOneAndUpdate(
        { email: email }, // Filter to find the user by email
        { username: username, password: hashedPassword }, // Updated username and hashed password
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the updated user data as JSON response
      res.json({message: 'user updated', success: true});
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  
  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
         const normalizedEmail = email.toLowerCase(); // Normalize email to lowercase

    // Check if the user with the normalized email exists in the database
    const existingUser = await User.findOne({ email: normalizedEmail });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // If password matches, generate a JWT token
      const token = jwt.sign(
        {
          userId: existingUser.id,
          email: existingUser.email
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "30d" }
      );
  
       // Update the user's 'logged' status to true in the database
    await User.findOneAndUpdate({ email }, { logged: true });
      // Respond with success message, user email, and token
      res.status(200).json({message: true, token: token, res: existingUser.email  });
  
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  
  const signupUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const normalizedEmail = email.toLowerCase();
  
      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email: normalizedEmail });
  
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user document using the User model
      const newUser = new User({
        role: 'null',
        username,
        email: normalizedEmail,
        password: hashedPassword,
      });
  
      // Save the new user document to the database
      await newUser.save();
  
      // Generate a JWT token for the newly registered user
      const token = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "30d" }
      );
  
      // Return the token and success response
      res.status(201).json({ message: "User registered successfully", token: token });
  
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const verifyToken = async (req, res, next) => {
    if(req.headers.authorization) { 
      var token = req.headers.authorization.split(' ')[1]
    }
  
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      // Attach the decoded user ID to the request for further processing
      req.userId = decoded.userId;
      console.log(decoded)
      next()

    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(403).json({ message: "Invalid token" });
    }
  };

  module.exports = {updateUser,getOneUser,verifyToken, getUser, signupUser, loginUser, updateRole}