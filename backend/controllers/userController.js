const User = require("../models/User")

// GET PROFILE
exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user).select("-password")

    res.json(user)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }

}


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.bio = req.body.bio || user.bio
    user.github = req.body.github || user.github
    user.linkedin = req.body.linkedin || user.linkedin
    user.experienceLevel = req.body.experienceLevel || user.experienceLevel
    user.role = req.body.role || user.role

    if (req.body.skills) {
      user.skills = req.body.skills
    }

    await user.save()

    res.json(user)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }

}