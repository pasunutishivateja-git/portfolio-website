const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

const Project = require("../models/project");


// ================= CREATE PROJECT =================

router.post("/", authMiddleware, async (req, res) => {

  try {

    const newProject = new Project(req.body);

    const savedProject = await newProject.save();

    res.status(201).json(savedProject);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= GET ALL PROJECTS =================

router.get("/", async (req, res) => {

  try {

    const projects = await Project.find();

    res.json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= UPDATE PROJECT =================

router.put("/:id", authMiddleware, async (req, res) => {

  try {

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedProject);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= DELETE PROJECT =================

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    await Project.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Project deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;