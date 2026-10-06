const express = require('express');
const {
  getCategories,
  getCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getCategories);
router.get('/:identifier', getCategoryDetail);

// Admin Routes
router.post('/', protect, authorize('admin', 'manager'), createCategory);
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCategory);

module.exports = router;
