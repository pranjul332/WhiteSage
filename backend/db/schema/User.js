const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String }, // URL of the user's profile picture
    auth0Id: { type: String, required: true, unique: true }, // Auth0 ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
