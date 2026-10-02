const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên điểm đến'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug điểm đến'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    region: {
      type: String,
      enum: ['chau-a', 'chau-au', 'chau-my', 'chau-uc', 'chau-phi', 'viet-nam'],
      required: [true, 'Vui lòng chọn khu vực/châu lục'],
    },
    country: {
      type: String,
      required: [true, 'Vui lòng nhập quốc gia'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    highlights: [
      {
        type: String,
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

destinationSchema.index({ region: 1, isPopular: 1, isActive: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
