const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// 1. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected!"))
  .catch(err => console.log("❌ Connection Error:", err));

// 2. Test Route (To check if the server is running)
app.get('/', (req, res) => {
  res.send("API is running...");
});

// 3. Simple Post Route to test Database Writing
app.post('/api/test', async (req, res) => {
  try {
    const { name } = req.body;
    // We'll just send back what we received for now
    res.json({ message: `Success! Received: ${name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));