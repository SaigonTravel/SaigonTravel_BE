const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Vui lòng nhập tên khách hàng'],
      trim: true,
    },
    clientRole: {
      type: String,
      default: '', // e.g. "HR Director", "Du khách", "Trưởng đoàn"
      trim: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Vui lòng nhập lời nhận xét'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    },
    eventProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventProject',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

testimonialSchema.index({ isApproved: 1, isFeatured: 1, order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
