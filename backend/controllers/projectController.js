const Project = require("../models/Project")
const User = require("../models/User")

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {

    const { title, description, requiredSkills, maxMembers } = req.body

    const project = new Project({
      title,
      description,
      requiredSkills,
      maxMembers,
      owner: req.user,
      members: [req.user]
    })

    await project.save()

    // add project to user's createdProjects
    await User.findByIdAndUpdate(req.user, {
      $push: { createdProjects: project._id }
    })

    res.status(201).json({
      message: "Project created successfully",
      project
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


// GET ALL PROJECTS
exports.getProjects = async (req, res) => {

  try {

    const projects = await Project.find()
      .populate("owner", "name skills")
      .populate("members", "name")

    res.json(projects)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }

}



// APPLY TO PROJECT

exports.applyToProject = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // prevent owner applying
    if (project.owner.toString() === req.user) {
      return res.status(400).json({ message: "Owner cannot apply" })
    }

    // prevent duplicate applications
    const alreadyApplied = project.applicants.find(
      app => app.user.toString() === req.user
    )

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this project" })
    }

    project.applicants.push({
      user: req.user,
      status: "pending"
    })

    await project.save()

    res.json({ message: "Application submitted" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }

}



// ACCEPT APPLICANT

exports.acceptApplicant = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // only owner can accept
    if (project.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const applicant = project.applicants.find(
      app => app.user.toString() === req.params.userId
    )

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" })
    }

    applicant.status = "accepted"

    project.members.push(req.params.userId)

    await project.save()

    await User.findByIdAndUpdate(req.params.userId, {
      $push: { joinedProjects: project._id }
    })

    res.json({ message: "Applicant accepted" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }

}


// REJECT APPLICANT

exports.rejectApplicant = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (project.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const applicant = project.applicants.find(
      app => app.user.toString() === req.params.userId
    )

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" })
    }

    applicant.status = "rejected"

    await project.save()

    res.json({ message: "Applicant rejected" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }

}