const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// MOVE the variable declarations INSIDE the post route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Now the server will look at the .env file exactly when you click login
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  console.log("--- Login Attempt ---");
  console.log("Input Email:", email);
  console.log("Env Email:", ADMIN_EMAIL); 
  console.log("Match?:", email === ADMIN_EMAIL);

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;