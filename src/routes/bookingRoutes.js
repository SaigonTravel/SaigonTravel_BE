const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Khách hàng gửi yêu cầu tư vấn / đặt tour (Public)
router.post('/', createBooking);

// Các endpoint quản lý (Yêu cầu đăng nhập)
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id', protect, updateBooking);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteBooking);

module.exports = router;
