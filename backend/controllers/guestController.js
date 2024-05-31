const Guest = require("../Models/GuestModel");

const getGuest = async (req, res) => {
  const user = await Guest.find();
  res.json(user);
};

const getOneGuest = async (req, res) => {
  const { email } = req.params; // Extract email from request parameters

  try {
    // Find the user by email in the database
    const guest = await Guest.findOne({ email });

    if (!guest) {
      // If user is not found, return 404 Not Found
      return res.status(404).json({ message: "guest not found" });
    }

    // If user is found, return user object as JSON response
    res.json(guest);
  } catch (error) {
    console.error("Error fetching user:", error);
    // Handle internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

const addGuest = async (req, res) => {
  const { username, table } = req.body;

  try {
    // // Check if the user with the normalized username exists in the database
    // const existingUser = await Guest.findOne({ username });

    // if (!existingUser) {
    //   return res.status(404).json({ message: "guest not found" });
    // }

    const createGuest = new Guest({ table: table, username: username });

    await createGuest.save();

    // Respond with success message, user email, and token
    res.status(200).json({ user: username, table: table });
  } catch (error) {
    console.error("Error finding guest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getGuest, getOneGuest, addGuest };
