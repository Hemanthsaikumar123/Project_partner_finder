import { useState, useEffect } from 'react';
import axios from 'axios';
import AddProject from './AddProject';
import './Dashboard.css';

function Dashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const addNewProjectToList = (newProj) => {
    setProjects([newProj, ...projects]);
  };

  // Load projects from Backend when the page opens
  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const handleJoin = async (projectId) => {
    if (!user) return alert("Please login first!");

    const token = localStorage.getItem('token');
    
    try {
      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/join`, 
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || "Error joining project");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">📋 Available Projects</h2>
        {user && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-project-btn">
            {showAddForm ? '✕ Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showAddForm && user && (
        <AddProject 
          onProjectAdded={addNewProjectToList} 
          onClose={() => setShowAddForm(false)}
        />
      )}
      
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-projects">No projects available. Be the first to create one!</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="skills-section">
                <strong className="skills-label">Skills needed:</strong>
                <div className="skills-container">
                  {project.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <p className="project-slots">
                <strong>👥 Slots:</strong> {project.applicants.filter(a => a.status === 'accepted').length} / {project.maxMembers}
              </p>
              {user && (
                <button onClick={() => handleJoin(project._id)} className="join-btn">
                  🤝 Request to Join
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
