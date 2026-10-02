const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Lấy thông tin cấu hình website & sliders (Public cho Frontend)
router.get('/', getSettings);

// Cập nhật cấu hình website (Admin/Manager)
router.put('/', protect, authorize('admin', 'manager'), updateSettings);

module.exports = router;
