const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên danh mục'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['tour', 'teambuilding', 'service', 'event', 'article'],
      required: [true, 'Vui lòng chọn loại danh mục'],
      default: 'tour',
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
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

categorySchema.index({ type: 1, isActive: 1, order: 1 });

module.exports = mongoose.model('Category', categorySchema);
