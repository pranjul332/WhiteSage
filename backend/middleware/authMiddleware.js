const { auth } = require("express-oauth2-jwt-bearer");
const dotenv = require("dotenv");

dotenv.config();

// This is the standard JWT verification middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

const authMiddleware = (req, res, next) => {
  // Apply the JWT check
  checkJwt(req, res, (err) => {
    if (err) {
      console.error("Auth error:", err);
      return res
        .status(401)
        .json({ message: "Unauthorized", error: err.message });
    }

    if (!req.auth) {
      return res
        .status(401)
        .json({ message: "Invalid token structure - auth object missing" });
    }

    if (!req.auth.payload.sub) {
      return res
        .status(401)
        .json({ message: "Invalid token structure - sub claim missing" });
    }

    // Set user ID from the 'sub' claim
    req.userId = req.auth.payload.sub;

    next();
  });
};

module.exports = authMiddleware; 
