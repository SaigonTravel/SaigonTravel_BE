const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const swaggerSpec = require('./docs/swagger');

const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const settingRoutes = require('./routes/settingRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const eventProjectRoutes = require('./routes/eventProjectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();

// API Docs (Swagger UI) - đặt trước helmet vì CSP mặc định chặn asset của Swagger UI
app.get(['/api-docs.json', '/api/docs.json'], (req, res) => res.json(swaggerSpec));
app.use(['/api-docs', '/api/docs'], swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Saigon Travel API Docs',
  swaggerOptions: { persistAuthorization: true },
}));

// Security & Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Đảm bảo đã kết nối MongoDB trước khi vào route (Vercel không chạy server.js nên không có bước connect lúc khởi động)
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/event-projects', eventProjectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/galleries', galleryRoutes);

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
      docs: '/api/docs',
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
