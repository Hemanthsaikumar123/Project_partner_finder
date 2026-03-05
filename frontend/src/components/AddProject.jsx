import { useState } from 'react';
import axios from 'axios';

function AddProject({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    maxMembers: 4
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split the skills string into an array
      const projectData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim())
      };
      
      const res = await axios.post('http://localhost:5000/api/projects/add', projectData);
      alert("Project Posted!");
      onProjectAdded(res.data); // Update the list on the main page
      setFormData({ title: '', description: '', requiredSkills: '', maxMembers: 4 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '40px', padding: '20px', border: '2px dashed #007bff', borderRadius: '10px' }}>
      <h3>Post a New Project Idea</h3>
      <input type="text" placeholder="Project Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={inputStyle} /><br/>
      <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={inputStyle} /><br/>
      <input type="text" placeholder="Skills (comma separated: Java, React)" value={formData.requiredSkills} onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})} required style={inputStyle} /><br/>
      <button type="submit" style={buttonStyle}>Post Project</button>
    </form>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };

export default AddProject;