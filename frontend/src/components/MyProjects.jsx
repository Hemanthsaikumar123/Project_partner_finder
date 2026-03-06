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
        // Filter projects created by the current user OR where user is an applicant
        const userProjects = res.data.filter(p => {
          const isOwner = p.owner?._id === user.id || p.owner === user.id;
          const isApplicant = p.applicants?.some(a => 
            a.user?._id === user.id || a.user === user.id
          );
          return isOwner || isApplicant;
        });
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
      const userProjects = updatedProjects.data.filter(p => {
        const isOwner = p.owner?._id === user.id || p.owner === user.id;
        const isApplicant = p.applicants?.some(a => 
          a.user?._id === user.id || a.user === user.id
        );
        return isOwner || isApplicant;
      });
      setMyProjects(userProjects);
    } catch (err) {
      alert(err.response?.data?.msg || `Error ${action}ing applicant`);
    }
  };

  const handleDeleteApplicant = async (projectId, applicantId) => {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to remove this applicant?')) return;
    
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/projects/${projectId}/applicant/${applicantId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert(res.data.msg);
      // Refresh the projects list
      const updatedProjects = await axios.get('http://localhost:5000/api/projects');
      const userProjects = updatedProjects.data.filter(p => {
        const isOwner = p.owner?._id === user.id || p.owner === user.id;
        const isApplicant = p.applicants?.some(a => 
          a.user?._id === user.id || a.user === user.id
        );
        return isOwner || isApplicant;
      });
      setMyProjects(userProjects);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error removing applicant');
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

  // Separate created and joined projects
  const createdProjects = myProjects.filter(p => p.owner?._id === user.id || p.owner === user.id);
  const joinedProjects = myProjects.filter(p => {
    const isOwner = p.owner?._id === user.id || p.owner === user.id;
    const isApplicant = p.applicants?.some(a => 
      a.user?._id === user.id || a.user === user.id
    );
    return !isOwner && isApplicant;
  });

  return (
    <div className="my-projects-container">
      <h2 className="my-projects-title">📂 My Projects</h2>
      
      {/* Created Projects Section */}
      <div className="projects-section">
        <h3 className="section-title">🎨 Created by Me</h3>
        {createdProjects.length === 0 ? (
          <p className="no-projects-message">You haven't created any projects yet. Go to the dashboard to create one!</p>
        ) : (
          <div className="my-projects-grid">
            {createdProjects.map(project => {
              const isOwner = project.owner?._id === user.id || project.owner === user.id;
              return (
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
                          {isOwner && (
                            <div className="applicant-actions">
                              {applicant.status === 'pending' && (
                                <>
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
                                </>
                              )}
                              <button 
                                onClick={() => handleDeleteApplicant(project._id, applicant.user?._id)}
                                className="delete-btn"
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Joined Projects Section */}
      <div className="projects-section">
        <h3 className="section-title">🤝 Projects I Joined</h3>
        {joinedProjects.length === 0 ? (
          <p className="no-projects-message">You haven't joined any projects yet. Browse the dashboard to join projects!</p>
        ) : (
          <div className="my-projects-grid">
            {joinedProjects.map(project => {
              const myApplication = project.applicants?.find(a => 
                a.user?._id === user.id || a.user === user.id
              );
              return (
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
                  {myApplication && (
                    <div className="my-status-section">
                      <p className="my-status">
                        <strong>My Status:</strong> 
                        <span className={`status-badge status-${myApplication.status}`}>
                          {myApplication.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
