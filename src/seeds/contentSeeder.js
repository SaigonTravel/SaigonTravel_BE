require('dotenv').config();
const mongoose = require('mongoose');
const { Service, EventProject, Gallery, Category } = require('../models');

async function seedContent() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saigontravel_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Content Seeding...');

    // 1. Get or create categories for teambuilding and services
    const tbCategory = await Category.findOneAndUpdate(
      { slug: 'dich-vu-teambuilding' },
      {
        name: 'Dịch Vụ Team Building',
        slug: 'dich-vu-teambuilding',
        type: 'service',
        description: 'Các dịch vụ tổ chức teambuilding và sự kiện chuyên nghiệp cho doanh nghiệp.',
        order: 1,
      },
      { upsert: true, new: true }
    );

    // 2. Seed Services
    console.log('Seeding Services...');
    await Service.deleteMany({});
    const servicesData = [
      {
        title: 'Team Building Bãi Biển (Beach Team Building)',
        slug: 'team-building-bai-bien',
        category: tbCategory._id,
        serviceType: 'teambuilding',
        shortDescription:
          'Chương trình gắn kết đồng đội bùng nổ năng lượng trên những bãi biển đẹp nhất Việt Nam: Phú Quốc, Nha Trang, Phan Thiết, Vũng Tàu.',
        content:
          'Chương trình Team Building bãi biển được thiết kế với chuỗi game đối kháng và game liên hoàn quy mô lớn. Các thử thách đòi hỏi sự phối hợp nhịp nhàng, chiến lược linh hoạt và tinh thần đồng đội cao độ. Đạo cụ game khổng lồ rực rỡ sắc màu, cùng đội ngũ MC hoạt náo tràn đầy nhiệt huyết.',
        targetAudience: 'Doanh nghiệp từ 30 đến 1.000+ nhân sự',
        suggestedLocations: ['Đảo Phú Quốc', 'Nha Trang', 'Phan Thiết / Mũi Né', 'Vũng Tàu / Hồ Tràm', 'Đà Nẵng'],
        highlights: [
          'Hệ thống game tool khổng lồ, an toàn, độc quyền',
          'MC hoạt náo chuyên nghiệp, truyền cảm hứng mạnh mẽ',
          'Ekip quay phim flycam, chụp ảnh ghi lại toàn bộ khoảnh khắc',
          'Kịch bản game may đo riêng theo giá trị cốt lõi của từng doanh nghiệp',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
          'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200',
        ],
        order: 1,
        isFeatured: true,
      },
      {
        title: 'Amazing Race – Hành Trình Chinh Phục & Khám Phá',
        slug: 'amazing-race-chinh-phuc-kham-pha',
        category: tbCategory._id,
        serviceType: 'amazing_race',
        shortDescription:
          'Format đua kỳ thú độc đáo, giải mật thư và vượt qua các trạm thử thách bí mật tại các địa hình đồi núi, rừng thông và phố cổ.',
        content:
          'Amazing Race là chương trình rèn luyện kỹ năng sinh tồn, định vị phương hướng, tư duy phản biện và khả năng phối hợp nhóm tuyệt vời. Các đội chơi được trang bị bản đồ số/GPS, giải các mật thư hóc búa để tìm đường đến trạm kế tiếp và cùng nhau vượt qua thử thách cam go.',
        targetAudience: 'Doanh nghiệp, cấp quản lý, đội ngũ kinh doanh (Sales & Marketing)',
        suggestedLocations: ['Đà Lạt (Rừng thông & Hồ Tuyền Lâm)', 'Hội An', 'Ninh Bình', 'Tây Bắc'],
        highlights: [
          'Format giải mật thư sáng tạo, cốt truyện kịch tính',
          'Ứng dụng công nghệ định vị GPS theo thời gian thực',
          'Rèn luyện thể lực kết hợp tư duy chiến lược cho đội ngũ',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200',
        ],
        order: 2,
        isFeatured: true,
      },
      {
        title: 'Gala Dinner & Year End Party (Đêm Hội Vinh Danh)',
        slug: 'gala-dinner-year-end-party',
        category: tbCategory._id,
        serviceType: 'gala_dinner',
        shortDescription:
          'Thiết kế và tổ chức đêm tiệc tri ân, vinh danh thành tích cá nhân xuất sắc với sân khấu lung linh, âm thanh ánh sáng đỉnh cao.',
        content:
          'Đêm tiệc Gala Dinner là điểm nhấn lắng đọng nhất trong mỗi chuyến đi của công ty. Saigon Travel mang đến ý tưởng concept độc đáo, thiết kế backdrop sang trọng, kịch bản chương trình hấp dẫn đan xen giữa phần lễ trang trọng và phần hội bùng nổ cảm xúc.',
        targetAudience: 'Toàn thể cán bộ nhân viên công ty và khách mời VIP',
        suggestedLocations: ['Trung tâm hội nghị', 'Khách sạn 5 sao', 'Resort bãi biển', 'Khu nghỉ dưỡng'],
        highlights: [
          'Sân khấu, màn hình LED, âm thanh ánh sáng chuẩn sự kiện cao cấp',
          'Key visual và video visual thiết kế riêng theo chủ đề công ty',
          'Minigame sân khấu vui nhộn, văn nghệ giao lưu kết nối',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200',
        ],
        order: 3,
        isFeatured: true,
      },
      {
        title: 'Hội Nghị – Hội Thảo & Du Lịch MICE',
        slug: 'hoi-nghi-hoi-thao-du-lich-mice',
        category: tbCategory._id,
        serviceType: 'mice_conference',
        shortDescription:
          'Dịch vụ tổ chức hội nghị khách hàng, hội thảo chuyên đề kết hợp du lịch nghỉ dưỡng trọn gói từ A đến Z.',
        content:
          'Saigon Travel tự hào là đơn vị uy tín hàng đầu trong lĩnh vực MICE tại Việt Nam. Chúng tôi đảm nhận toàn bộ khâu chuẩn bị: Đặt phòng khách sạn cao cấp, phòng họp tiêu chuẩn quốc tế, trang thiết bị dịch thuật cabin, teabreak chu đáo và tour du ngoạn tham quan.',
        targetAudience: 'Hội nghị đối tác, đại lý, hiệp hội doanh nghiệp, hội thảo quốc tế',
        suggestedLocations: ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Phú Quốc', 'Nha Trang'],
        highlights: [
          'Kinh nghiệm 17+ năm xử lý sự kiện MICE quốc tế',
          'Mạng lưới đối tác khách sạn 4 - 5 sao trên cả nước',
          'Đội ngũ điều phối viên lễ tân chỉn chu, chuyên nghiệp',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200',
        ],
        order: 4,
        isFeatured: true,
      },
    ];

    const insertedServices = await Service.insertMany(servicesData);
    console.log(`Seeded ${insertedServices.length} Services.`);

    const beachService = insertedServices.find((s) => s.serviceType === 'teambuilding');
    const raceService = insertedServices.find((s) => s.serviceType === 'amazing_race');
    const galaService = insertedServices.find((s) => s.serviceType === 'gala_dinner');

    // 3. Seed Event Projects / Case Studies (NEC, Bosch, Hoàn Mỹ, Shiseido...)
    console.log('Seeding Event Projects (Portfolio)...');
    await EventProject.deleteMany({});
    const eventProjectsData = [
      {
        title: 'NEC Việt Nam – Chào Phú Quốc 2024',
        slug: 'nec-viet-nam-chao-phu-quoc',
        clientName: 'NEC Việt Nam',
        clientLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
        service: beachService?._id,
        location: 'Đảo Phú Quốc, Kiên Giang',
        participantsCount: 250,
        eventDate: new Date('2024-06-15'),
        overview:
          'Chương trình Team Building bãi biển và Gala Dinner kỷ niệm hành trình phát triển của tập đoàn công nghệ NEC Việt Nam.',
        content:
          'Với chủ đề "One Team - One Dream", hơn 250 nhân sự NEC đã có những giây phút bùng nổ cảm xúc trên bãi biển Bãi Sao - Phú Quốc với những thử thách vượt rào cản và chinh phục mục tiêu chung.',
        thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
          'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200',
        ],
        isFeatured: true,
        order: 1,
      },
      {
        title: 'Bosch Việt Nam – Bứt Phá Mọi Giới Hạn',
        slug: 'bosch-viet-nam-but-pha-gioi-han',
        clientName: 'Bosch Việt Nam',
        clientLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
        service: beachService?._id,
        location: 'Hồ Tràm, Bà Rịa - Vũng Tàu',
        participantsCount: 450,
        eventDate: new Date('2024-08-20'),
        overview:
          'Ngày hội Teambuilding thường niên dành cho đại gia đình cán bộ nhân viên Bosch Việt Nam tại bãi biển Hồ Tràm.',
        content:
          'Quy tụ hơn 450 kỹ sư và chuyên viên cấp cao của Bosch trong chuỗi trò chơi liên hoàn trên cát và đêm nhạc hội EDM sôi động bên bờ biển.',
        thumbnail: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200',
        ],
        isFeatured: true,
        order: 2,
      },
      {
        title: 'Tập Đoàn Y Khoa Hoàn Mỹ – 26 Năm Gắn Kết',
        slug: 'hoan-my-26-years-hanh-trinh-phung-su',
        clientName: 'Hoàn Mỹ Medical Corporation',
        clientLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
        service: galaService?._id,
        location: 'Nha Trang, Khánh Hòa',
        participantsCount: 300,
        eventDate: new Date('2024-11-10'),
        overview:
          'Chương trình kỷ niệm 26 năm thành lập hệ thống y khoa Hoàn Mỹ kết hợp nghỉ dưỡng biển và tiệc tri ân trang trọng.',
        content:
          'Đêm dạ tiệc kỷ niệm 26 năm với sự tham gia của ban lãnh đạo và đội ngũ y bác sĩ đầu ngành trên khắp cả nước, cùng nhìn lại chặng đường phụng sự sức khỏe cộng đồng.',
        thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200',
        ],
        isFeatured: true,
        order: 3,
      },
      {
        title: 'Shiseido Việt Nam – Leadership Camp Đà Lạt',
        slug: 'shiseido-viet-nam-leadership-camp',
        clientName: 'Shiseido Cosmetics Việt Nam',
        clientLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
        service: raceService?._id,
        location: 'Đà Lạt, Lâm Đồng',
        participantsCount: 80,
        eventDate: new Date('2025-01-18'),
        overview:
          'Khóa huấn luyện kỹ năng lãnh đạo Amazing Race giữa rừng thông Đà Lạt cho các cấp quản lý Shiseido.',
        content:
          'Format Amazing Race giải mật thư, định vị tọa độ và cắm trại qua đêm đã giúp đội ngũ quản lý Shiseido nâng cao khả năng phản ứng linh hoạt và thấu hiểu lẫn nhau sâu sắc.',
        thumbnail: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200',
        ],
        isFeatured: true,
        order: 4,
      },
    ];

    const insertedEvents = await EventProject.insertMany(eventProjectsData);
    console.log(`Seeded ${insertedEvents.length} Event Projects.`);

    // 4. Seed Galleries (Lightbox Albums)
    console.log('Seeding Galleries...');
    await Gallery.deleteMany({});
    const galleriesData = [
      {
        title: 'Khoảnh Khắc Bùng Nổ Cùng NEC Tại Phú Quốc',
        slug: 'album-nec-viet-nam-phu-quoc',
        description: 'Tổng hợp những khoảnh khắc đẹp nhất trong chương trình Teambuilding bãi biển của NEC Việt Nam.',
        coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        category: tbCategory._id,
        eventProject: insertedEvents[0]?._id,
        items: [
          {
            url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
            thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300',
            title: 'Khởi động năng lượng',
            caption: 'Toàn đoàn khởi động rạng rỡ trên bãi biển Phú Quốc',
            sortOrder: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200',
            thumbnailUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300',
            title: 'Chinh phục thử thách liên hoàn',
            caption: 'Các đội tranh tài gay cấn trong game vượt chướng ngại vật',
            sortOrder: 2,
          },
          {
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
            title: 'Niềm vui chiến thắng',
            caption: 'Nụ cười rạng rỡ của các thành viên khi về đích chung một mục tiêu',
            sortOrder: 3,
          },
        ],
        isFeatured: true,
        order: 1,
      },
      {
        title: 'Amazing Race Khám Phá Cao Nguyên Đà Lạt',
        slug: 'album-amazing-race-da-lat',
        description: 'Những góc ảnh ấn tượng trong hành trình giải mật thư sinh tồn tại rừng thông Đà Lạt.',
        coverImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
        category: tbCategory._id,
        eventProject: insertedEvents[3]?._id,
        items: [
          {
            url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=300',
            title: 'Bình minh săn mây',
            caption: 'Khởi động trạm đua số 1 tại đồi chè Cầu Đất',
            sortOrder: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200',
            thumbnailUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=300',
            title: 'Giải mật thư bí mật',
            caption: 'Các đội trưởng họp bàn phương án tiếp cận trạm mật thư',
            sortOrder: 2,
          },
        ],
        isFeatured: true,
        order: 2,
      },
    ];

    const insertedGalleries = await Gallery.insertMany(galleriesData);
    console.log(`Seeded ${insertedGalleries.length} Galleries.`);

    await mongoose.connection.close();
    console.log('Content seeding completed. Database connection closed.');
  } catch (error) {
    console.error('Error during content seeding:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedContent();
}

module.exports = seedContent;
