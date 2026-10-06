const express = require('express');
const {
  getGalleries,
  getGalleryDetail,
  createGallery,
  updateGallery,
  deleteGallery,
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getGalleries);
router.get('/:identifier', getGalleryDetail);

// Admin routes
router.post('/', protect, authorize('admin', 'manager'), createGallery);
router.put('/:id', protect, authorize('admin', 'manager'), updateGallery);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteGallery);

module.exports = router;
