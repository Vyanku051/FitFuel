const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const workoutRoutes = require('./routes/workouts');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

// Ensure Node uses a working DNS resolver for Atlas SRV lookups.
// If your local DNS service on 127.0.0.1 blocks SRV queries, override it here.
if (!process.env.DNS_SERVERS) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} else {
  dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
}

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => console.log('DB Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'FitFuel API is running 🔥' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});