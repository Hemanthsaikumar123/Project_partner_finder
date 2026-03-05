const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: String, default: "Admin" }, // We'll link to User IDs later
  requiredSkills: [String],
  applicants: [{
    user: String,
    status: { type: String, default: 'pending' }
  }],
  maxMembers: { type: Number, default: 4 }
});

module.exports = mongoose.model('Project', ProjectSchema);