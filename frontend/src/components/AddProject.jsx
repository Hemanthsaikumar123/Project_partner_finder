import { useState } from 'react';
import axios from 'axios';
import './AddProject.css';

function AddProject({ onProjectAdded, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    maxMembers: 4
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const projectData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim())
      };
      
      const res = await axios.post(
        'http://localhost:5000/api/projects/add', 
        projectData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert("Project Posted!");
      onProjectAdded(res.data);
      setFormData({ title: '', description: '', requiredSkills: '', maxMembers: 4 });
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error posting project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-project-form">
      <div className="form-header">
        <h3 className="form-title">✨ Post a New Project</h3>
        <button type="button" onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="form-group">
        <label className="form-label">Project Title</label>
        <input 
          type="text" 
          placeholder="Enter project title" 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
          required 
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea 
          placeholder="Describe your project idea..." 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          required 
          className="form-textarea"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Required Skills</label>
          <input 
            type="text" 
            placeholder="e.g., React, Node.js, Python" 
            value={formData.requiredSkills} 
            onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})} 
            required 
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Max Members</label>
          <input 
            type="number" 
            min="2"
            max="10"
            value={formData.maxMembers} 
            onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})} 
            required 
            className="form-input"
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">🚀 Post Project</button>
    </form>
  );
}

export default AddProject;