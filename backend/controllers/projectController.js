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