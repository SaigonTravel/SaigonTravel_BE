const mongoose = require('mongoose');
const generateUniqueCode = require('../utils/generateUniqueCode');

const bookingSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['tour_booking', 'teambuilding_request', 'custom_mice', 'consultation'],
      default: 'tour_booking',
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    customer: {
      fullName: { type: String, required: [true, 'Vui lòng nhập họ tên'], trim: true },
      email: { type: String, required: [true, 'Vui lòng nhập email'], trim: true },
      phone: { type: String, required: [true, 'Vui lòng nhập số điện thoại'], trim: true },
      companyName: { type: String, default: '', trim: true },
      address: { type: String, default: '', trim: true },
      note: { type: String, default: '' },
    },
    details: {
      departureDate: { type: Date },
      returnDate: { type: Date },
      durationDays: { type: Number },
      adultsCount: { type: Number, default: 1 },
      childrenCount: { type: Number, default: 0 },
      infantsCount: { type: Number, default: 0 },
      participantCount: { type: Number, default: 0 }, // For corporate/teambuilding
      destinationPreference: { type: String, default: '' },
      estimatedBudget: { type: String, default: '' }, // e.g. "50 - 100 triệu"
      specialRequests: { type: String, default: '' },
    },
    pricing: {
      totalAmount: { type: Number, default: 0 },
      depositAmount: { type: Number, default: 0 },
      currency: { type: String, default: 'VND' },
      paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded'],
        default: 'pending',
      },
      paymentMethod: {
        type: String,
        enum: ['unspecified', 'bank_transfer', 'cash', 'vnpay', 'credit_card'],
        default: 'unspecified',
      },
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'processing', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    staffNotes: [
      {
        staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

bookingSchema.pre('save', async function (next) {
  if (!this.code) {
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.code = await generateUniqueCode(this.constructor, `SGT-${datePrefix}-`);
  }
  next();
});

// Phục vụ màn hình admin: lọc theo status, sắp xếp mới nhất (code đã có unique index riêng)
bookingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
