const express = require('express');
const {
  getTours,
  getTourDetail,
  createTour,
  updateTour,
  deleteTour,
  updateTourStatus,
  duplicateTour,
} = require('../controllers/tourController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getTours);
router.get('/:identifier', getTourDetail);

// Admin & Manager routes
router.post('/', protect, authorize('admin', 'manager'), createTour);
router.put('/:id', protect, authorize('admin', 'manager'), updateTour);
router.patch('/:id/status', protect, authorize('admin', 'manager'), updateTourStatus);
router.post('/:id/duplicate', protect, authorize('admin', 'manager'), duplicateTour);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTour);

module.exports = router;
