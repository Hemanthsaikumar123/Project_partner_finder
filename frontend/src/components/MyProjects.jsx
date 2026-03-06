import { useState, useEffect } from 'react';
import axios from 'axios';
import './MyProjects.css';

function MyProjects({ user }) {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    axios.get('http://localhost:5000/api/projects')
      .then(res => {
        // Filter projects created by the current user
        const userProjects = res.data.filter(p => p.owner === user.id);
        setMyProjects(userProjects);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, [user]);

  const handleApplicantAction = async (projectId, applicantId, action) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/${action}`,
        { applicantId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert(res.data.msg);
      // Refresh the projects list
      const updatedProjects = await axios.get('http://localhost:5000/api/projects');
      const userProjects = updatedProjects.data.filter(p => p.owner === user.id);
      setMyProjects(userProjects);
    } catch (err) {
      alert(err.response?.data?.msg || `Error ${action}ing applicant`);
    }
  };

  if (!user) {
    return (
      <div className="my-projects-container">
        <h2 className="loading-message">Please login to view your projects</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-projects-container">
        <h2 className="loading-message">Loading your projects...</h2>
      </div>
    );
  }

  return (
    <div className="my-projects-container">
      <h2 className="my-projects-title">📂 My Projects</h2>
      {myProjects.length === 0 ? (
        <p className="no-projects-message">You haven't created any projects yet. Go to the dashboard to create one!</p>
      ) : (
        <div className="my-projects-grid">
          {myProjects.map(project => (
            <div key={project._id} className="my-project-card project-card">
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
              
              {project.applicants.length > 0 && (
                <div className="applicants-section">
                  <h4 className="applicants-title">Applicants:</h4>
                  {project.applicants.map((applicant, idx) => (
                    <div key={idx} className="applicant-row">
                      <span className="applicant-name">{applicant.user?.name || 'Unknown User'}</span>
                      <span className={`status-badge status-${applicant.status}`}>
                        {applicant.status}
                      </span>
                      {applicant.status === 'pending' && (
                        <div className="applicant-actions">
                          <button 
                            onClick={() => handleApplicantAction(project._id, applicant.user?._id, 'accept')}
                            className="accept-btn"
                          >
                            ✓ Accept
                          </button>
                          <button 
                            onClick={() => handleApplicantAction(project._id, applicant.user?._id, 'reject')}
                            className="reject-btn"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;
