const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên dịch vụ'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug dịch vụ'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    serviceType: {
      type: String,
      enum: [
        'teambuilding',
        'amazing_race',
        'gala_dinner',
        'mice_conference',
        'training_workshop',
        'year_end_party',
        'family_day',
        'other'
      ],
      default: 'teambuilding',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    targetAudience: {
      type: String,
      default: '', // e.g. "Doanh nghiệp từ 20 - 1000 người"
    },
    suggestedLocations: [
      {
        type: String, // e.g. "Phú Quốc", "Đà Lạt", "Vũng Tàu", "Phan Thiết"
      },
    ],
    highlights: [
      {
        type: String,
      },
    ],
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
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

serviceSchema.index({ serviceType: 1, isFeatured: 1, isActive: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
