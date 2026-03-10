const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  requiredSkills: [
    {
      type: String
    }
  ],

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
      }
    }
  ],

  maxMembers: {
    type: Number,
    default: 4
  }

},
{ timestamps: true }
)

module.exports = mongoose.model("Project", projectSchema)