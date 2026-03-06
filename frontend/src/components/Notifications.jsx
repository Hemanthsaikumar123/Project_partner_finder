import { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/read-all',
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${notificationId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  if (!user) {
    return (
      <div className="notifications-container">
        <h2 className="loading-message">Please login to view notifications</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="notifications-container">
        <h2 className="loading-message">Loading notifications...</h2>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2 className="notifications-title">🔔 Notifications</h2>
      </div>
      
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet!</p>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="notification-actions">
                <button 
                  onClick={() => deleteNotification(notification._id)}
                  className="delete-notif-btn"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
