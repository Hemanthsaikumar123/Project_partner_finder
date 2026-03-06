const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // Link to the User who created the project
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requiredSkills: [String],
  // Array of Objects linking to User models
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' }
  }],
  maxMembers: { type: Number, default: 4 }
});

module.exports = mongoose.model('Project', ProjectSchema);