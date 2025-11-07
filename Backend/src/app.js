const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();


// ✅ Correct CORS setup for cookies
app.use(cors({
  origin: "http://localhost:5173", // your React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// ✅ Start server on port 5173
const PORT = 5173;
app.listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
});

module.exports = app;
