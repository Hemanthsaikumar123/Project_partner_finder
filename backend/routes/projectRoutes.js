const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new project (for testing)
router.post('/add', async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST Join a project
router.post('/:id/join', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    // Check if user already applied (using a dummy ID for now)
    const userId = req.body.userId;
    const exists = project.applicants.find(a => a.user === userId);
    
    if (exists) return res.status(400).json({ msg: "Already applied!" });

    project.applicants.push({ user: userId, status: 'pending' });
    await project.save();
    res.json({ msg: "Successfully applied to join!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;