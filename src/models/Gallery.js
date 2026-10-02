const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên album ảnh'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug album'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    eventProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventProject',
    },
    items: [galleryItemSchema],
    isFeatured: {
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
  },
  { timestamps: true }
);

gallerySchema.index({ isFeatured: 1, order: 1, isActive: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
