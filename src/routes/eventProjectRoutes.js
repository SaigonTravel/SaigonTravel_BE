const express = require('express');
const {
  getEventProjects,
  getEventProjectDetail,
  createEventProject,
  updateEventProject,
  deleteEventProject,
} = require('../controllers/eventProjectController');
const { protect, authorize, optionalAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', optionalAuth, getEventProjects);
router.get('/:identifier', optionalAuth, getEventProjectDetail);

// Admin routes
router.post('/', protect, authorize('admin', 'manager'), createEventProject);
router.put('/:id', protect, authorize('admin', 'manager'), updateEventProject);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteEventProject);

module.exports = router;
