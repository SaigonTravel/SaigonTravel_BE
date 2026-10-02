const express = require('express');
const {
  getEventProjects,
  getEventProjectDetail,
  createEventProject,
  updateEventProject,
  deleteEventProject,
} = require('../controllers/eventProjectController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getEventProjects);
router.get('/:identifier', getEventProjectDetail);

// Admin routes
router.post('/', protect, authorize('admin', 'manager'), createEventProject);
router.put('/:id', protect, authorize('admin', 'manager'), updateEventProject);
router.delete('/:id', protect, authorize('admin'), deleteEventProject);

module.exports = router;
