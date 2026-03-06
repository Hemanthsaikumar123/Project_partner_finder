const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', '_id name email')
      .populate('applicants.user', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new project (protected route)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      owner: req.userId  // Get owner from authenticated user
    };
    const project = new Project(projectData);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST Join a project (protected route)
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.userId; // Get from authenticated user

    // Get project and applicant info
    const project = await Project.findById(projectId).populate('owner', '_id name email');
    const applicant = await User.findById(userId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 1. Add User to Project's applicant list
    await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { applicants: { user: userId } } }, // $addToSet prevents duplicates
      { new: true }
    );

    // 2. Add Project to User's joinedProjects list (The Mapping!)
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { joinedProjects: projectId } }
    );

    // 3. Create notification for project owner
    await User.findByIdAndUpdate(
      project.owner._id,
      { 
        $push: { 
          notifications: {
            message: `${applicant.name} requested to join "${project.title}"`,
            projectId: projectId,
            fromUser: userId,
            read: false,
            createdAt: new Date()
          }
        }
      }
    );

    res.json({ msg: "Successfully requested to join project!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Accept an applicant (protected route)
router.post('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const applicantId = req.body.applicantId;

    // Verify the user is the owner of the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to accept applicants" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, 'applicants.user': applicantId },
      { $set: { 'applicants.$.status': 'accepted' } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ msg: "Applicant not found" });
    }

    res.json({ msg: "Applicant accepted!", project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Reject an applicant (protected route)
router.post('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const applicantId = req.body.applicantId;

    // Verify the user is the owner of the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to reject applicants" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, 'applicants.user': applicantId },
      { $set: { 'applicants.$.status': 'rejected' } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ msg: "Applicant not found" });
    }

    res.json({ msg: "Applicant rejected!", project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Remove an applicant (protected route)
router.delete('/:id/applicant/:applicantId', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const applicantId = req.params.applicantId;

    // Verify the user is the owner of the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to remove applicants" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { applicants: { user: applicantId } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({ msg: "Applicant removed!", project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;