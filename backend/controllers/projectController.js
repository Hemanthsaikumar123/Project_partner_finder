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

    const acceptedUser = await User.findById(req.params.userId).select("name")

    await User.findByIdAndUpdate(req.params.userId, {
      $push: { joinedProjects: project._id }
    })

    res.json({
      message: `${acceptedUser?.name || "Applicant"} accepted`,
      applicantName: acceptedUser?.name || null
    })

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

    const rejectedUser = await User.findById(req.params.userId).select("name")

    res.json({
      message: `${rejectedUser?.name || "Applicant"} rejected`,
      applicantName: rejectedUser?.name || null
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }

}


//SINGLE PROJECT DETAILS(Members can get private details but not all)

exports.getProjectById = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id)
      .populate("owner", "name email github linkedin skills")
      .populate("members", "name email github linkedin skills")
      .populate("applicants.user", "name skills")

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    const isOwner = project.owner._id.toString() === req.user

    const isMember = project.members.some(
      member => member._id.toString() === req.user
    )

    let response = {
      _id: project._id,
      title: project.title,
      description: project.description,
      requiredSkills: project.requiredSkills,
      maxMembers: project.maxMembers,
      owner: {
        name: project.owner.name
      },
      membersCount: project.members.length
    }

    // If user is a member → show member contact details
    if (isMember || isOwner) {

      response.members = project.members

    }

    // If user is owner → show applicants
    if (isOwner) {

      response.applicants = project.applicants

    }

    res.json(response)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }

}



// GET PROJECTS CREATED BY USER

exports.getMyProjects = async (req, res) => {

  try {

    const projects = await Project.find({ owner: req.user })
      .populate("members", "name email")
      .populate("applicants.user", "name email skills")

    res.json(projects)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }

}



// GET PROJECTS USER APPLIED TO

exports.getAppliedProjects = async (req, res) => {

  try {

    const projects = await Project.find({
      "applicants.user": req.user
    }).populate("owner", "name")

    const result = projects.map(project => {

      const application = project.applicants.find(
        app => app.user.toString() === req.user
      )

      return {
        _id: project._id,
        title: project.title,
        owner: project.owner,
        status: application.status
      }

    })

    res.json(result)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }

}