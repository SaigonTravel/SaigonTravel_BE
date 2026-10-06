const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    meals: [
      {
        type: String,
        trim: true,
      },
    ],
    accommodation: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên tour'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Vui lòng nhập slug tour'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true,
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    duration: {
      days: { type: Number, default: 1 },
      nights: { type: Number, default: 0 },
      text: { type: String, default: '' }, // e.g. "8 Ngày 7 Đêm"
    },
    departureLocation: {
      type: String,
      default: 'TP. Hồ Chí Minh',
      trim: true,
    },
    departureSchedule: {
      type: String,
      default: '', // e.g. "Khởi hành thứ 5 hàng tuần"
    },
    departureDates: [
      {
        type: Date,
      },
    ],
    price: {
      adult: { type: Number, required: true, default: 0 },
      child: { type: Number, default: 0 },
      singleSupplement: { type: Number, default: 0 },
      originalPrice: { type: Number, default: 0 },
      currency: { type: String, default: 'VND' },
    },
    groupSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 50 },
    },
    languages: [
      {
        type: String,
        default: 'Tiếng Việt',
      },
    ],
    overview: {
      type: String,
      default: '',
    },
    highlights: [
      {
        type: String,
      },
    ],
    itinerary: [itineraryDaySchema],
    inclusions: [
      {
        type: String,
      },
    ],
    exclusions: [
      {
        type: String,
      },
    ],
    policies: {
      cancellation: { type: String, default: '' },
      terms: { type: String, default: '' },
      children: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
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
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 5 },
      count: { type: Number, default: 0 },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

tourSchema.index({ status: 1, isFeatured: 1, 'price.adult': 1 });
tourSchema.index({ destinations: 1 });
tourSchema.index({ categories: 1 });
tourSchema.index({ title: 'text', overview: 'text' });

module.exports = mongoose.model('Tour', tourSchema);
