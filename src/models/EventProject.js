const mongoose = require('mongoose');

const eventProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên sự kiện/dự án'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, 'Vui lòng nhập tên khách hàng/doanh nghiệp'],
      trim: true,
    },
    clientLogo: {
      type: String,
      default: '',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    location: {
      type: String,
      default: '', // e.g. "Phú Quốc", "Đà Lạt"
      trim: true,
    },
    participantsCount: {
      type: Number,
      default: 0,
    },
    eventDate: {
      type: Date,
    },
    overview: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    gallery: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

eventProjectSchema.index({ isFeatured: 1, order: 1, status: 1 });

module.exports = mongoose.model('EventProject', eventProjectSchema);
