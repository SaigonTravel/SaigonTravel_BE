const { Setting } = require('../models');

/**
 * @desc    Lấy thông tin cấu hình website & Sliders (Public)
 * @route   GET /api/settings
 * @access  Public
 */
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();

    // Nếu chưa có trong DB, tự động khởi tạo bản ghi mặc định
    if (!settings) {
      settings = await Setting.create({
        companyName: 'Công Ty Du Lịch Dịch Vụ Sài Gòn (Saigon Travel)',
        slogan: 'Sounds Great!',
        hotline: '(+84)8 9898 8687',
        phone: '0989 898 687',
        email: 'mice@saigon-travel.com',
        address: '123 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP. Hồ Chí Minh',
        workingHours: 'Thứ 2 - Thứ 6: 08:30 - 17:30 | Thứ 7: 08:30 - 12:00',
        socialLinks: {
          facebook: 'https://www.facebook.com/SaigonTravel/',
          youtube: 'https://youtube.com/@saigontravel',
          zalo: '0989898687',
          tiktok: 'https://tiktok.com/@saigontravel',
          instagram: 'https://instagram.com/saigontravel',
        },
        logo: 'https://saigon-travel.com/wp-content/uploads/2019/01/02.png',
        sliders: [
          {
            title: 'SAIGON TRAVEL - HÀNH TRÌNH CHINH PHỤC THẾ GIỚI',
            subtitle: 'Chuyên tour Châu Âu, Châu Á cao cấp với trải nghiệm dịch vụ chuẩn mực',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920',
            link: '/tours',
            buttonText: 'Xem Các Tour Nổi Bật',
            order: 1,
            isActive: true,
          },
          {
            title: 'TEAMBUILDING & SỰ KIỆN DOANH NGHIỆP ĐẲNG CẤP',
            subtitle: 'Gắn kết đội ngũ - Bứt phá mọi giới hạn cùng Saigon Travel MICE',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920',
            link: '/services',
            buttonText: 'Nhận Báo Giá Đoàn',
            order: 2,
            isActive: true,
          },
        ],
        aboutIntro: {
          title: 'Về Saigon Travel',
          shortDescription:
            'Công ty du lịch dịch vụ uy tín chất lượng với kinh nghiệm hơn 17 năm trong ngành dịch vụ lữ hành, sự kiện teambuilding và hội nghị MICE.',
          highlightStats: [
            { number: '17+', label: 'Năm kinh nghiệm' },
            { number: '1.000+', label: 'Chuyến đi thành công' },
            { number: '50.000+', label: 'Khách hàng hài lòng' },
          ],
        },
        footerInfo: {
          copyrightText: 'Copyright © 2026 Saigon Travel. All rights reserved.',
          licenseNumber: 'GP-LHQT: 79-xxxx/20xx/TCDL-GP LHQT',
        },
        seoDefault: {
          metaTitle: 'Saigon Travel - Du lịch, Teambuilding & Sự kiện MICE',
          metaDescription:
            'Saigon Travel, Công ty du lịch dịch vụ uy tín chất lượng với kinh nghiệm hơn 17 năm. Liên hệ ngay (+84)8 9898 8687 để được tư vấn tận tâm.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật thông tin cấu hình website (Admin/Manager)
 * @route   PUT /api/settings
 * @access  Private (Admin/Manager)
 */
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật cấu hình website thành công',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
