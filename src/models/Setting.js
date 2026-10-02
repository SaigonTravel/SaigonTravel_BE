const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    link: { type: String, default: '' },
    buttonText: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Saigon Travel',
    },
    slogan: {
      type: String,
      default: 'Sounds Great!',
    },
    hotline: {
      type: String,
      default: '(+84)8 9898 8687',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'mice@saigon-travel.com',
    },
    address: {
      type: String,
      default: 'TP. Hồ Chí Minh, Việt Nam',
    },
    workingHours: {
      type: String,
      default: 'Thứ 2 - Thứ 6: 08:30 - 17:30',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://www.facebook.com/SaigonTravel/' },
      youtube: { type: String, default: '' },
      zalo: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    sliders: [sliderSchema],
    aboutIntro: {
      title: { type: String, default: 'Về Saigon Travel' },
      shortDescription: { type: String, default: '' },
      highlightStats: [
        {
          number: { type: String, default: '17+' },
          label: { type: String, default: 'Năm kinh nghiệm' },
        },
        {
          number: { type: String, default: '1000+' },
          label: { type: String, default: 'Chuyến đi thành công' },
        },
        {
          number: { type: String, default: '50.000+' },
          label: { type: String, default: 'Khách hàng hài lòng' },
        },
      ],
    },
    footerInfo: {
      copyrightText: { type: String, default: 'Copyright © 2026 Saigon Travel. All rights reserved.' },
      licenseNumber: { type: String, default: '' },
    },
    seoDefault: {
      metaTitle: { type: String, default: 'Saigon Travel - Du lịch, Teambuilding & Sự kiện MICE' },
      metaDescription: {
        type: String,
        default: 'Saigon Travel, Công ty du lịch dịch vụ uy tín chất lượng với kinh nghiệm hơn 17 năm trong ngành dịch vụ du lịch, teambuilding, sự kiện.',
      },
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
