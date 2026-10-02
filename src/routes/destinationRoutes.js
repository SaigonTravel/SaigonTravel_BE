const express = require('express');
const {
  getDestinations,
  getGroupedDestinations,
  getDestinationDetail,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getDestinations);
router.get('/grouped', getGroupedDestinations);
router.get('/:identifier', getDestinationDetail);

// Admin Routes
router.post('/', protect, authorize('admin', 'manager'), createDestination);
router.put('/:id', protect, authorize('admin', 'manager'), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

module.exports = router;
