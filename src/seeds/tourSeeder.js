require('dotenv').config();
const mongoose = require('mongoose');
const { Tour, Destination, Category } = require('../models');

const sampleDestinations = [
  {
    name: 'Pháp',
    slug: 'phap',
    region: 'chau-au',
    country: 'Pháp',
    city: 'Paris',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'Kinh đô ánh sáng với tháp Eiffel, bảo tàng Louvre và nghệ thuật kiến trúc hoa lệ.',
    highlights: ['Tháp Eiffel', 'Bảo tàng Louvre', 'Khải Hoàn Môn', 'Sông Seine'],
    isPopular: true,
    order: 1,
  },
  {
    name: 'Ý (Italy)',
    slug: 'y-italy',
    region: 'chau-au',
    country: 'Ý',
    city: 'Rome / Venice / Milan',
    thumbnail: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800',
    description: 'Cái nôi của văn hóa La Mã cổ đại với đấu trường Colosseum và thành phố trên sông Venice.',
    highlights: ['Đấu trường Colosseum', 'Thành Vatican', 'Thành phố Venice', 'Kinh đô thời trang Milan'],
    isPopular: true,
    order: 2,
  },
  {
    name: 'Thụy Sĩ',
    slug: 'thuy-si',
    region: 'chau-au',
    country: 'Thụy Sĩ',
    city: 'Zurich / Lucerne',
    thumbnail: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
    description: 'Xứ sở đồng hồ với những rặng núi tuyết Alps hùng vĩ và hồ nước trong xanh tuyệt mỹ.',
    highlights: ['Dãy núi Alps', 'Hồ Lucerne', 'Cầu gỗ Chapel', 'Thành phố Zurich'],
    isPopular: true,
    order: 3,
  },
  {
    name: 'Nhật Bản',
    slug: 'nhat-ban',
    region: 'chau-a',
    country: 'Nhật Bản',
    city: 'Tokyo / Kyoto / Osaka',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    description: 'Xứ sở Phù Tang kết hợp hài hòa giữa truyền thống cổ kính và công nghệ hiện đại bậc nhất.',
    highlights: ['Núi Phú Sĩ', 'Chùa Vàng Kinkaku-ji', 'Cung điện Tokyo', 'Khu phố Dotonbori'],
    isPopular: true,
    order: 4,
  },
  {
    name: 'Hàn Quốc',
    slug: 'han-quoc',
    region: 'chau-a',
    country: 'Hàn Quốc',
    city: 'Seoul / Jeju',
    thumbnail: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
    description: 'Xứ sở kim chi với văn hóa K-Pop, cung điện Gyeongbokgung cổ kính và đảo ngọc Jeju.',
    highlights: ['Đảo Nami', 'Cung điện Gyeongbokgung', 'Công viên Everland', 'Đảo Jeju'],
    isPopular: true,
    order: 5,
  },
  {
    name: 'Trung Quốc',
    slug: 'trung-quoc',
    region: 'chau-a',
    country: 'Trung Quốc',
    city: 'Trương Gia Giới / Phượng Hoàng Cổ Trấn',
    thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
    description: 'Kỳ quan thiên nhiên Trương Gia Giới hùng vĩ và Phượng Hoàng Cổ Trấn lung linh huyền ảo.',
    highlights: ['Phượng Hoàng Cổ Trấn', 'Trương Gia Giới', 'Cầu kính Trương Gia Giới', 'Thiên Môn Sơn'],
    isPopular: true,
    order: 6,
  },
  {
    name: 'Phú Quốc',
    slug: 'phu-quoc',
    region: 'viet-nam',
    country: 'Việt Nam',
    city: 'Kiên Giang',
    thumbnail: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
    description: 'Đảo ngọc nghỉ dưỡng hàng đầu Việt Nam, thiên đường cho các hoạt động Teambuilding bãi biển.',
    highlights: ['Bãi Sao', 'Cáp treo Hòn Thơm', 'Grand World', 'Hoạt động Teambuilding bãi biển'],
    isPopular: true,
    order: 7,
  },
  {
    name: 'Đà Lạt',
    slug: 'da-lat',
    region: 'viet-nam',
    country: 'Việt Nam',
    city: 'Lâm Đồng',
    thumbnail: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
    description: 'Thành phố ngàn hoa với khí hậu mát mẻ, địa điểm lý tưởng cho Amazing Race và Gala Dinner.',
    highlights: ['Hồ Tuyền Lâm', 'Thung Lũng Tình Yêu', 'Đỉnh Langbiang', 'Hoạt động Amazing Race'],
    isPopular: true,
    order: 8,
  },
];

const sampleCategories = [
  {
    name: 'Tour Châu Âu',
    slug: 'tour-chau-au',
    type: 'tour',
    description: 'Các hành trình khám phá Châu Âu cổ kính và sang trọng.',
    order: 1,
  },
  {
    name: 'Tour Châu Á',
    slug: 'tour-chau-a',
    type: 'tour',
    description: 'Khám phá văn hóa Á Đông độc đáo tại Nhật Bản, Hàn Quốc, Trung Quốc.',
    order: 2,
  },
  {
    name: 'Tour Nội Địa',
    slug: 'tour-noi-dia',
    type: 'tour',
    description: 'Du lịch trong nước khám phá vẻ đẹp danh lam thắng cảnh Việt Nam.',
    order: 3,
  },
  {
    name: 'Tour Doanh Nghiệp & MICE',
    slug: 'tour-doanh-nghiep-mice',
    type: 'teambuilding',
    description: 'Tour du lịch kết hợp tổ chức Teambuilding, Hội nghị và Gala Dinner cho doanh nghiệp.',
    order: 4,
  },
];

const seedTours = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saigontravel_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Seed Categories
    console.log('Seeding categories...');
    const catMap = {};
    for (const cat of sampleCategories) {
      const savedCat = await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true }
      );
      catMap[cat.slug] = savedCat._id;
    }

    // 2. Seed Destinations
    console.log('Seeding destinations...');
    const destMap = {};
    for (const dest of sampleDestinations) {
      const savedDest = await Destination.findOneAndUpdate(
        { slug: dest.slug },
        dest,
        { upsert: true, new: true }
      );
      destMap[dest.slug] = savedDest._id;
    }

    // 3. Clear old tours and legacy indexes before re-seeding
    console.log('Clearing existing tours and legacy indexes...');
    try {
      await Tour.collection.dropIndexes();
    } catch (e) {
      console.log('No previous indexes to drop or index dropped.');
    }
    await Tour.deleteMany({});

    // 4. Sample Tours Data
    const toursData = [
      {
        title: 'CHÂU ÂU: PHÁP – THỤY SĨ – Ý – VATICAN – MONACO',
        slug: 'chau-au-phap-thuy-si-y-vatican-monaco',
        code: 'SGT-EU01',
        destinations: [destMap['phap'], destMap['thuy-si'], destMap['y-italy']],
        categories: [catMap['tour-chau-au']],
        duration: {
          days: 10,
          nights: 9,
          text: '10 Ngày 9 Đêm',
        },
        departureLocation: 'TP. Hồ Chí Minh (Sân bay Tân Sơn Nhất)',
        departureSchedule: 'Khởi hành thứ 5 hàng tuần',
        departureDates: [
          new Date('2026-10-15'),
          new Date('2026-10-22'),
          new Date('2026-11-05'),
          new Date('2026-11-19'),
        ],
        price: {
          adult: 89900000,
          child: 76900000,
          infant: 29900000,
          singleSupplement: 18000000,
          originalPrice: 95000000,
          currency: 'VND',
        },
        groupSize: { min: 15, max: 25 },
        languages: ['Tiếng Việt', 'Tiếng Anh'],
        overview:
          'Hành trình độc đáo đưa quý khách đi qua những quốc gia xinh đẹp và hoa lệ nhất Châu Âu: Khám phá Paris hoa lệ, Thụy Sĩ cổ tích dưới chân rặng Alps, Rome hùng tráng và vương quốc sòng bài Monaco xa hoa.',
        highlights: [
          'Bay hãng hàng không quốc tế 5 sao cao cấp',
          'Du thuyền ngắm cảnh sông Seine lãng mạn tại Paris',
          'Trải nghiệm cáp treo lên đỉnh núi tuyết Titlis (Thụy Sĩ)',
          'Khám phá đấu trường La Mã Colosseum và quốc gia tí hon Vatican',
          'Thưởng thức ẩm thực chuẩn vị châu Âu và vang Pháp danh tiếng',
        ],
        itinerary: [
          {
            day: 1,
            title: 'TP. HỒ CHÍ MINH – PARIS (PHÁP)',
            content:
              'Quý khách tập trung tại sân bay Tân Sơn Nhất, làm thủ tục đáp chuyến bay đi Paris. Nghỉ đêm trên máy bay.',
            meals: ['Ăn tối trên máy bay'],
            accommodation: 'Khách sạn 4 sao tại Paris',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          },
          {
            day: 2,
            title: 'KHÁM PHÁ KINH ĐÔ ÁNH SÁNG PARIS',
            content:
              'Tham quan tháp Eiffel, chụp ảnh tại Khải Hoàn Môn và dạo bước trên đại lộ Champs-Élysées. Du thuyền trên sông Seine thơ mộng ngắm Paris về chiều.',
            meals: ['Bữa sáng', 'Bữa trưa', 'Bữa tối'],
            accommodation: 'Khách sạn 4 sao Novotel Paris hoặc tương đương',
            image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800',
          },
          {
            day: 3,
            title: 'PARIS – LUCERNE (THỤY SĨ)',
            content:
              'Khởi hành sang đất nước Thụy Sĩ thanh bình. Tham quan thành phố Lucerne với Cầu Gỗ Chapel cổ kính, Tượng đài Sư tử đá Lion Monument.',
            meals: ['Bữa sáng', 'Bữa trưa', 'Bữa tối'],
            accommodation: 'Khách sạn 4 sao tại Lucerne',
            image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
          },
          {
            day: 4,
            title: 'LUCERNE – ĐỈNH NÚI TITLIS – MILAN (Ý)',
            content:
              'Chinh phục đỉnh Titlis bằng cáp treo xoay 360 độ ngắm toàn cảnh tuyết trắng vĩnh cửu. Buổi chiều di chuyển về kinh đô thời trang Milan (Ý).',
            meals: ['Bữa sáng', 'Bữa trưa', 'Bữa tối'],
            accommodation: 'Khách sạn 4 sao tại Milan',
            image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800',
          },
          {
            day: 5,
            title: 'MILAN – VENICE – THÀNH PHỐ TÌNH YÊU TRÊN NƯỚC',
            content:
              'Di chuyển đến Venice, trải nghiệm thuyền Gondola len lỏi qua các con kênh nhỏ, ghé Quảng trường St. Marco và Cầu Than Thở lừng danh.',
            meals: ['Bữa sáng', 'Bữa trưa', 'Bữa tối'],
            accommodation: 'Khách sạn 4 sao tại Venice Mestre',
            image: 'https://images.unsplash.com/photo-1523906834658-6e259b58e2ee?w=800',
          },
        ],
        inclusions: [
          'Vé máy bay khứ hồi quốc tế kèm hành lý ký gửi 30kg + 7kg xách tay',
          'Khách sạn tiêu chuẩn 4 sao quốc tế (phòng 2 người)',
          'Các bữa ăn theo chương trình kết hợp món Âu và món Việt',
          'Xe du lịch đời mới máy lạnh đưa đón suốt tuyến',
          'Vé tham quan các điểm theo chương trình',
          'Bảo hiểm du lịch quốc tế mức bồi thường tới 1.000.000.000 VND',
          'Hướng dẫn viên chuyên nghiệp theo đoàn suốt tuyến từ Việt Nam',
        ],
        exclusions: [
          'Phí làm visa Schengen Châu Âu',
          'Chi phí cá nhân: giặt ủi, điện thoại, minibar',
          'Tiền tip cho hướng dẫn viên và tài xế (khoảng 8 EUR/ngày/khách)',
          'Phụ thu phòng đơn',
        ],
        policies: {
          cancellation:
            'Hủy sau khi đặt cọc: mất 100% tiền cọc. Hủy trước ngày khởi hành 15 - 20 ngày: phạt 80% tổng giá tour. Hủy trong vòng 14 ngày: phạt 100% tổng giá tour.',
          terms:
            'Hộ chiếu còn hạn trên 6 tháng tính từ ngày kết thúc tour. Quý khách cần cung cấp hồ sơ visa trước ít nhất 45 ngày làm việc.',
          children:
            'Trẻ em dưới 2 tuổi tính 30% giá vé người lớn. Trẻ em từ 2 đến dưới 11 tuổi tính 85% giá người lớn (ngủ chung giường bố mẹ). Từ 11 tuổi trở lên tính giá như người lớn.',
          notes:
            'Thứ tự các điểm tham quan có thể thay đổi linh hoạt tùy theo tình hình thực tế nhưng vẫn đảm bảo đầy đủ các điểm trong chương trình.',
        },
        faqs: [
          {
            question: 'Thời gian xin visa Châu Âu mất bao lâu?',
            answer:
              'Thông thường quy trình xét duyệt visa Schengen mất từ 15 đến 25 ngày làm việc. Quý khách nên chuẩn bị hồ sơ trước 1 - 2 tháng.',
          },
          {
            question: 'Thời tiết Châu Âu vào thời điểm này như thế nào?',
            answer:
              'Châu Âu có khí hậu ôn đới mát mẻ dễ chịu, nhiệt độ trung bình từ 15 - 24 độ C rất thích hợp cho việc du ngoạn ngắm cảnh.',
          },
        ],
        thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
          'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1200',
          'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200',
          'https://images.unsplash.com/photo-1523906834658-6e259b58e2ee?w=1200',
        ],
        isFeatured: true,
        isHot: true,
        status: 'published',
        rating: { average: 4.9, count: 28 },
      },
      {
        title: 'HÀN QUỐC: SEOUL – ĐẢO JEJU – EVERLAND – NAMI',
        slug: 'han-quoc-seoul-dao-jeju-everland-nami',
        code: 'SGT-KR02',
        destinations: [destMap['han-quoc']],
        categories: [catMap['tour-chau-a']],
        duration: {
          days: 5,
          nights: 4,
          text: '5 Ngày 4 Đêm',
        },
        departureLocation: 'TP. Hồ Chí Minh',
        departureSchedule: 'Khởi hành thứ 4 và thứ 7 hàng tuần',
        departureDates: [
          new Date('2026-10-18'),
          new Date('2026-10-25'),
          new Date('2026-11-01'),
        ],
        price: {
          adult: 18990000,
          child: 16200000,
          infant: 6000000,
          singleSupplement: 4500000,
          originalPrice: 21900000,
          currency: 'VND',
        },
        groupSize: { min: 15, max: 30 },
        languages: ['Tiếng Việt', 'Tiếng Hàn'],
        overview:
          'Khám phá xứ sở Kim Chi với vẻ đẹp lãng mạn của Đảo Nami, hòa mình vào không gian sôi động tại công viên giải trí Everland, mua sắm thả ga tại Seoul và chiêm ngưỡng thiên nhiên thanh bình tại đảo ngọc Jeju.',
        highlights: [
          'Dạo bước trên hàng cây ngân hạnh tuyệt đẹp tại Đảo Nami',
          'Trải nghiệm mặc trang phục Hanbok truyền thống tại Cung điện Gyeongbokgung',
          'Vui chơi không giới hạn tại công viên giải trí hàng đầu Everland',
          'Thưởng thức BBQ thịt nướng Hàn Quốc, lẩu nấm và gà hầm sâm nổi tiếng',
        ],
        itinerary: [
          {
            day: 1,
            title: 'TP. HỒ CHÍ MINH – SEOUL',
            content: 'Đáp chuyến bay đêm đi Seoul. Quý khách nghỉ ngơi trên máy bay.',
            meals: ['Ăn nhẹ trên máy bay'],
            accommodation: 'Khách sạn 4 sao tại Seoul',
            image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
          },
          {
            day: 2,
            title: 'SEOUL – ĐẢO NAMI LÃNG MẠN',
            content:
              'Đến Seoul, ăn sáng sau đó khởi hành đi Đảo Nami – phim trường của bộ phim kinh điển Bản Tình Ca Mùa Đông.',
            meals: ['Bữa sáng', 'Bữa trưa gà nướng', 'Bữa tối lẩu nấm'],
            accommodation: 'Khách sạn 4 sao tại Seoul',
            image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800',
          },
          {
            day: 3,
            title: 'CÔNG VIÊN EVERLAND – TRẢI NGHIỆM LÀM KIM CHI',
            content:
              'Tham gia lớp học làm Kim Chi truyền thống và mặc Hanbok chụp ảnh kỷ niệm. Chiều vui chơi thỏa thích tại Everland Theme Park.',
            meals: ['Bữa sáng', 'Bữa trưa', 'Bữa tối BBQ'],
            accommodation: 'Khách sạn 4 sao tại Seoul',
            image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800',
          },
        ],
        inclusions: [
          'Vé máy bay khứ hồi Sài Gòn - Seoul',
          'Khách sạn 4 sao tiêu chuẩn Hàn Quốc',
          'Ăn uống đủ các bữa theo lịch trình',
          'Vé vào cổng tham quan Everland, Đảo Nami',
          'Bảo hiểm du lịch quốc tế',
        ],
        exclusions: [
          'Phí visa Hàn Quốc',
          'Tiền tip hướng dẫn viên (6 USD/ngày/khách)',
          'Chi tiêu cá nhân ngoài chương trình',
        ],
        policies: {
          cancellation: 'Quy định hủy tour theo tiêu chuẩn lữ hành quốc tế.',
          terms: 'Hộ chiếu còn hạn trên 6 tháng. Miễn visa nếu có visa Mỹ/Canada/Schengen theo quy định hiện hành.',
        },
        thumbnail: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200',
          'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200',
        ],
        isFeatured: true,
        isHot: true,
        status: 'published',
        rating: { average: 4.8, count: 42 },
      },
      {
        title: 'NHẬT BẢN: TOKYO – FUJI – KYOTO – OSAKA',
        slug: 'nhat-ban-tokyo-fuji-kyoto-osaka',
        code: 'SGT-JP03',
        destinations: [destMap['nhat-ban']],
        categories: [catMap['tour-chau-a']],
        duration: {
          days: 6,
          nights: 5,
          text: '6 Ngày 5 Đêm',
        },
        departureLocation: 'TP. Hồ Chí Minh',
        departureSchedule: 'Khởi hành ngày 10 và 24 hàng tháng',
        departureDates: [
          new Date('2026-10-24'),
          new Date('2026-11-10'),
          new Date('2026-11-24'),
        ],
        price: {
          adult: 32900000,
          child: 28500000,
          infant: 9500000,
          singleSupplement: 8500000,
          originalPrice: 36000000,
          currency: 'VND',
        },
        groupSize: { min: 15, max: 28 },
        languages: ['Tiếng Việt', 'Tiếng Nhật'],
        overview:
          'Hành trình vàng cung đường ngắm hoa và núi Phú Sĩ qua 4 thành phố tiêu biểu của xứ sở mặt trời mọc: Tokyo hiện đại, Phú Sĩ hùng vĩ, cố đô Kyoto cổ kính và thiên đường ẩm thực Osaka.',
        highlights: [
          'Trải nghiệm tàu siêu tốc Shinkansen tốc độ 300km/h',
          'Chụp hình cùng biểu tượng núi Phú Sĩ thiêng liêng',
          'Thưởng thức bò Kobe trứ danh và tắm Onsen truyền thống Nhật Bản',
          'Dạo bước trong rừng trúc Sagano và viếng Chùa Vàng Kinkaku-ji',
        ],
        itinerary: [
          {
            day: 1,
            title: 'TP. HỒ CHÍ MINH – TOKYO (NARITA)',
            content: 'Bay thẳng đến sân bay quốc tế Narita. Bắt đầu chuyến du hành đất nước mặt trời mọc.',
            meals: ['Bữa tối'],
            accommodation: 'Khách sạn 4 sao Tokyo',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
          },
          {
            day: 2,
            title: 'TOKYO – NÚI PHÚ SĨ – TẮM ONSEN',
            content: 'Di chuyển đến trạm số 5 Núi Phú Sĩ (nếu thời tiết cho phép). Thư giãn với suối nước khoáng nóng Onsen.',
            meals: ['Bữa sáng', 'Bữa trưa', 'Bữa tối Kaiseki'],
            accommodation: 'Khách sạn phong cách Ryokan Onsen tại khu vực Phú Sĩ',
            image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800',
          },
        ],
        inclusions: [
          'Vé máy bay Vietnam Airlines hoặc ANA khứ hồi',
          'Vé tàu Shinkansen 1 chặng',
          'Khách sạn 4 sao + 1 đêm trải nghiệm Onsen cao cấp',
          'Bảo hiểm du lịch quốc tế',
        ],
        exclusions: ['Phí visa Nhật Bản', 'Tiền tip hướng dẫn viên'],
        thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
          'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200',
        ],
        isFeatured: true,
        status: 'published',
        rating: { average: 5.0, count: 35 },
      },
      {
        title: 'TRUNG QUỐC: TRƯƠNG GIA GIỚI – PHƯỢNG HOÀNG CỔ TRẤN',
        slug: 'trung-quoc-truong-gia-gioi-phuong-hoang-co-tran',
        code: 'SGT-CN04',
        destinations: [destMap['trung-quoc']],
        categories: [catMap['tour-chau-a']],
        duration: {
          days: 6,
          nights: 5,
          text: '6 Ngày 5 Đêm',
        },
        departureLocation: 'TP. Hồ Chí Minh',
        departureSchedule: 'Khởi hành thứ 3 và thứ 6 hàng tuần',
        departureDates: [new Date('2026-10-20'), new Date('2026-11-03')],
        price: {
          adult: 15990000,
          child: 13900000,
          infant: 5500000,
          originalPrice: 17900000,
          currency: 'VND',
        },
        groupSize: { min: 15, max: 30 },
        languages: ['Tiếng Việt', 'Tiếng Trung'],
        overview:
          'Chiêm ngưỡng chốn bồng lai tiên cảnh Trương Gia Giới – nơi lấy bối cảnh cho siêu phẩm điện ảnh Avatar, và lạc bước vào bức tranh thủy mặc nghìn năm tuổi tại Phượng Hoàng Cổ Trấn bên dòng Đà Giang.',
        highlights: [
          'Cầu kính Đại Hiệp Cốc Trương Gia Giới thử thách lòng dũng cảm',
          'Ngắm cảnh đêm lung linh huyền ảo của Phượng Hoàng Cổ Trấn',
          'Chinh phục đỉnh Thiên Môn Sơn với 99 khúc cua ngoạn mục',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200',
        ],
        isFeatured: true,
        status: 'published',
        rating: { average: 4.7, count: 19 },
      },
      {
        title: 'PHÚ QUỐC: NGHỈ DƯỠNG BIỂN & TEAMBUILDING DOANH NGHIỆP',
        slug: 'phu-quoc-nghi-duong-bien-teambuilding-doanh-nghiep',
        code: 'SGT-PQ05',
        destinations: [destMap['phu-quoc']],
        categories: [catMap['tour-noi-dia'], catMap['tour-doanh-nghiep-mice']],
        duration: {
          days: 3,
          nights: 2,
          text: '3 Ngày 2 Đêm',
        },
        departureLocation: 'TP. Hồ Chí Minh / Hà Nội',
        departureSchedule: 'Khởi hành theo yêu cầu của đoàn doanh nghiệp',
        departureDates: [new Date('2026-10-16'), new Date('2026-10-30')],
        price: {
          adult: 4890000,
          child: 3600000,
          infant: 1200000,
          originalPrice: 5500000,
          currency: 'VND',
        },
        groupSize: { min: 30, max: 500 },
        languages: ['Tiếng Việt', 'Tiếng Anh'],
        overview:
          'Chương trình thiết kế chuyên biệt cho các cơ quan, đoàn thể và doanh nghiệp kết hợp du lịch nghỉ dưỡng đảo ngọc Phú Quốc với chuỗi trò chơi Teambuilding bãi biển gắn kết tinh thần đồng đội và tiệc Gala Dinner đẳng cấp.',
        highlights: [
          'Kịch bản Teambuilding bãi biển sáng tạo theo thông điệp của công ty',
          'Đêm tiệc Gala Dinner hoành tráng với âm thanh, ánh sáng, MC chuyên nghiệp',
          'Nghỉ dưỡng tại resort 4 - 5 sao sát biển tiêu chuẩn quốc tế',
          'Tặng gói quay phim, chụp ảnh flycam highlight toàn bộ sự kiện',
        ],
        itinerary: [
          {
            day: 1,
            title: 'SÀI GÒN – PHÚ QUỐC – CHECK-IN RESORT – KHỞI ĐỘNG TEAMBUILDING',
            content:
              'Đón đoàn tại sân bay Phú Quốc, xe đưa về resort nhận phòng. Chiều tổ chức chuỗi trò chơi Teambuilding bãi biển: Vượt sóng lớn, Chung một mục tiêu, Chinh phục đỉnh cao.',
            meals: ['Bữa trưa', 'Bữa tối hải sản'],
            accommodation: 'Resort 4-5 sao sát biển tại Phú Quốc',
            image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
          },
          {
            day: 2,
            title: 'KHÁM PHÁ NAM ĐẢO – ĐÊM TIỆC GALA DINNER',
            content:
              'Buổi sáng dạo chơi cáp treo Hòn Thơm hoặc lặn ngắm san hô. Tối tổ chức đêm hội Gala Dinner tôn vinh thành tích công ty, vinh danh cá nhân xuất sắc và giao lưu văn nghệ.',
            meals: ['Bữa sáng', 'Bữa trưa', 'Bữa tối tiệc Gala'],
            accommodation: 'Resort 4-5 sao tại Phú Quốc',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
          },
          {
            day: 3,
            title: 'MUA SẮM ĐẶC SẢN – TẠM BIỆT PHÚ QUỐC',
            content:
              'Tự do tắm biển, mua sắm ngọc trai, hồ tiêu Phú Quốc. Xe đưa đoàn ra sân bay trở về điểm xuất phát.',
            meals: ['Bữa sáng', 'Bữa trưa'],
            accommodation: '',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          },
        ],
        inclusions: [
          'Vé máy bay khứ hồi (tùy chọn theo gói)',
          'Resort 4 sao hoặc 5 sao theo yêu cầu',
          'Trọn gói kịch bản Teambuilding: Game tools, áo đội, banner, MC, điều phối viên',
          'Trọn gói Gala Dinner: Sân khấu, âm thanh, ánh sáng, màn hình LED, backdrop, quà minigame',
          'Quay flycam và chụp ảnh trả file sau tour',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
        ],
        isFeatured: true,
        status: 'published',
        rating: { average: 4.9, count: 56 },
      },
      {
        title: 'ĐÀ LẠT: SĂN MÂY CAO NGUYÊN & AMAZING RACE KHÁM PHÁ',
        slug: 'da-lat-san-may-cao-nguyen-amazing-race',
        code: 'SGT-DL06',
        destinations: [destMap['da-lat']],
        categories: [catMap['tour-noi-dia'], catMap['tour-doanh-nghiep-mice']],
        duration: {
          days: 3,
          nights: 2,
          text: '3 Ngày 2 Đêm',
        },
        departureLocation: 'TP. Hồ Chí Minh',
        departureSchedule: 'Khởi hành thứ 6 hàng tuần hoặc theo yêu cầu đoàn',
        departureDates: [new Date('2026-10-23'), new Date('2026-11-06')],
        price: {
          adult: 3250000,
          child: 2450000,
          infant: 800000,
          originalPrice: 3800000,
          currency: 'VND',
        },
        groupSize: { min: 20, max: 200 },
        languages: ['Tiếng Việt'],
        overview:
          'Tận hưởng bầu không khí se lạnh trong lành của xứ sở sương mù Đà Lạt, thử thách bản thân với format chương trình Amazing Race độc lạ giải mật thư quanh rừng thông và hồ Tuyền Lâm.',
        highlights: [
          'Kịch bản Amazing Race giải mật thư truy tìm kho báu',
          'Đêm lửa trại BBQ cồng chiêng Tây Nguyên ấm cúng',
          'Đón bình minh săn mây tại đồi chè Cầu Đất',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200',
        ],
        isFeatured: true,
        status: 'published',
        rating: { average: 4.8, count: 31 },
      },
    ];

    const insertedTours = await Tour.insertMany(toursData);
    console.log(`Successfully seeded ${insertedTours.length} tours!`);

    await mongoose.connection.close();
    console.log('Seeding completed. MongoDB connection closed.');
  } catch (error) {
    console.error('Error during tour seeding:', error);
    process.exit(1);
  }
};

// If run directly
if (require.main === module) {
  seedTours();
}

module.exports = seedTours;
