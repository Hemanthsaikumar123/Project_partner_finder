import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [projects, setProjects] = useState([]);

  // Load projects from Backend when the page opens
  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const handleJoin = (projectId) => {
    // For now, we'll hardcode a fake user ID until we build Login
    const fakeUserId = "65ca123abc456"; 
    
    axios.post(`http://localhost:5000/api/projects/${projectId}/join`, { userId: fakeUserId })
      .then(res => alert(res.data.msg))
      .catch(err => alert("Already applied or error!"));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Project Partner Finder</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map(project => (
          <div key={project._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div>
              <strong>Skills needed:</strong> {project.requiredSkills.join(', ')}
            </div>
            <p>Slots: {project.applicants.filter(a => a.status === 'accepted').length} / {project.maxMembers}</p>
            <button 
              onClick={() => handleJoin(project._id)}
              style={{ marginTop: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Request to Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;