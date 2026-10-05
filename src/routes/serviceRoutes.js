const express = require('express');
const {
  getServices,
  getServiceDetail,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getServices);
router.get('/:identifier', getServiceDetail);

// Admin routes
router.post('/', protect, authorize('admin', 'manager'), createService);
router.put('/:id', protect, authorize('admin', 'manager'), updateService);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteService);

module.exports = router;
