const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    bio: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["student", "developer", "designer", "founder", "other"],
      default: "developer"
    },

    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },

    skills: [
      {
        type: String
      }
    ],

    github: {
      type: String
    },

    linkedin: {
      type: String
    },

    createdProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],

    joinedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)