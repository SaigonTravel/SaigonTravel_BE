const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const settingRoutes = require('./routes/settingRoutes');

const app = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Saigon Travel API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Root API Welcome
app.get('/api', (req, res) => {
  res.json({
    name: 'Saigon Travel & Teambuilding API',
    version: '1.0.0',
    description: 'API phục vụ website Du lịch, Teambuilding, Sự kiện & MICE phong cách Yan Teambuilding',
    endpoints: {
      health: '/api/health',
      tours: '/api/tours',
      destinations: '/api/destinations',
      services: '/api/services',
      eventProjects: '/api/event-projects',
      bookings: '/api/bookings',
      articles: '/api/articles',
      galleries: '/api/galleries',
      testimonials: '/api/testimonials',
      contacts: '/api/contacts',
      settings: '/api/settings',
    },
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy đường dẫn: ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
