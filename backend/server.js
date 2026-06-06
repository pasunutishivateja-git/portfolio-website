const jwt = require('jsonwebtoken');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config({ path: './.env' });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const projectRoutes = require("./routes/projectRoutes");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/projects", projectRoutes);
const certificationRoutes = require("./routes/certificationRoutes");
app.use("/api/certifications", certificationRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
  console.log("Loaded Email from env:", process.env.ADMIN_EMAIL);
  console.log("Loaded Password from env:", process.env.ADMIN_PASSWORD);
});
// ==========================================
// ADMIN LOGIN ROUTE
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // 1. Check if the provided credentials match your .env file
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    
    // 2. Credentials match! Create the VIP Pass (JWT)
    // This token is valid for 1 day
    const token = jwt.sign(
      { role: 'admin' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } 
    );

    // 3. Send the token back to React
    res.json({ token: token });

  } else {
    // 4. Wrong password! Kick them out.
    res.status(401).json({ message: 'Invalid credentials' });
  }
});