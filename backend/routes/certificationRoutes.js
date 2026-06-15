const express = require("express");
const router = express.Router();
const Certification = require("../models/Certification");
const verifyToken = require("../middleware/authMiddleware"); // Assuming you have auth middleware to protect routes!

// GET all certificates
router.get("/", async (req, res) => {
  try {
    const certs = await Certification.find();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new certificate (Protected by Login)
router.post("/", verifyToken, async (req, res) => {
  const cert = new Certification({
    title: req.body.title,
    issuer: req.body.issuer,
    date: req.body.date,
  });
  try {
    const newCert = await cert.save();
    res.status(201).json(newCert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a certificate
router.delete("/:id", async (req, res) => {
  try {
    const deletedCert = await Certification.findByIdAndDelete(req.params.id);
    if (!deletedCert) return res.status(404).json({ message: "Certificate not found" });
    res.json({ message: "Certificate deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (Update) a certificate (Protected by Login)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedCert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;