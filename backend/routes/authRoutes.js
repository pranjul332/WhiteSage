const express = require("express");
const User = require("../db/schema/User"); // Import the User model
const router = express.Router();

// Auth0 user creation or login
router.post("/", async (req, res) => {
  // Destructure email, name, picture and sub from req.body
  const { email, name, picture, sub } = req.body;
  console.log(req.body);

  // Basic validation
  if (!email || !name || !sub) {
    return res.status(400).json({
      error: "Email, name and sub (Auth0 ID) are required",
    });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      // If the user exists, update the existing record
      user.name = name;
      user.picture = picture;
      // Don't update auth0Id as it shouldn't change
    } else {
      // Create a new user with the auth0Id
      user = new User({
        email,
        name,
        picture,
        auth0Id: sub,
      });
    }

    // Save user
    await user.save();

    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if user exists
router.get("/", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking user", error });
  }
});
// Logout route (for revoking tokens if needed)
router.post("/logout", async (req, res) => {
  // For JWT, client-side clearing is sufficient
  // This endpoint can be used for audit logging or token blacklisting
  return res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
