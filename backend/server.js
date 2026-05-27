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

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
  console.log("Loaded Email from env:", process.env.ADMIN_EMAIL);
  console.log("Loaded Password from env:", process.env.ADMIN_PASSWORD);
});