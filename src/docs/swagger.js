// OpenAPI 3.0 spec cho Saigon Travel API (phục vụ Swagger UI tại /api-docs)

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema) => ({ content: { 'application/json': { schema } } });

const ok = (dataSchema, description = 'Thành công') => ({
  description,
  ...json({
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: dataSchema,
    },
  }),
});

const errorResponses = {
  400: { $ref: '#/components/responses/BadRequest' },
  404: { $ref: '#/components/responses/NotFound' },
};
const authResponses = {
  401: { $ref: '#/components/responses/Unauthorized' },
  403: { $ref: '#/components/responses/Forbidden' },
};
const secured = [{ bearerAuth: [] }];

const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB ObjectId' };
// GET chi tiết nhận slug hoặc id; PUT/DELETE chỉ nhận id (cùng 1 path template trong OpenAPI)
const identifierParam = { ...idParam, description: 'Slug hoặc MongoDB ObjectId' };
const q = (name, schema, description) => ({ name, in: 'query', schema, description });
const boolQuery = (name, description) => q(name, { type: 'string', enum: ['true', 'false'] }, description);

// Tour & Event Project có trạng thái nháp: gửi token admin/manager (không bắt buộc) để xem được draft/archived
const DRAFT_TAGS = ['Tours', 'Event Projects'];
const draftNote = 'Khách chỉ thấy nội dung `published`. Gửi token admin/manager để xem draft/archived.';

// Sinh nhanh CRUD chuẩn: GET list, GET detail, POST, PUT, DELETE (admin/manager)
const crud = ({ tag, schema, listParams = [], label }) => {
  const publicRead = DRAFT_TAGS.includes(tag) ? { description: draftNote, security: [{}, { bearerAuth: [] }] } : {};
  return {
  list: {
    get: {
      tags: [tag],
      summary: `Lấy danh sách ${label}`,
      ...publicRead,
      parameters: listParams,
      responses: { 200: ok({ type: 'array', items: ref(schema) }) },
    },
    post: {
      tags: [tag],
      summary: `Tạo ${label} (Admin/Manager)`,
      security: secured,
      requestBody: { required: true, ...json(ref(`${schema}Input`)) },
      responses: { 201: ok(ref(schema), 'Tạo thành công'), ...errorResponses, ...authResponses },
    },
  },
  item: {
    get: {
      tags: [tag],
      summary: `Lấy chi tiết ${label} theo slug hoặc id`,
      ...publicRead,
      parameters: [identifierParam],
      responses: { 200: ok(ref(schema)), ...errorResponses },
    },
    put: {
      tags: [tag],
      summary: `Cập nhật ${label} (Admin/Manager)`,
      security: secured,
      parameters: [idParam],
      requestBody: { required: true, ...json(ref(`${schema}Input`)) },
      responses: { 200: ok(ref(schema)), ...errorResponses, ...authResponses },
    },
    delete: {
      tags: [tag],
      summary: `Xóa ${label} (Admin/Manager)`,
      security: secured,
      parameters: [idParam],
      responses: { 200: ok({ type: 'object' }), ...errorResponses, ...authResponses },
    },
  },
  };
};

const destinations = crud({
  tag: 'Destinations',
  schema: 'Destination',
  label: 'điểm đến',
  listParams: [
    q('region', { type: 'string', enum: ['chau-a', 'chau-au', 'chau-my', 'chau-uc', 'chau-phi', 'viet-nam'] }, 'Lọc theo khu vực'),
    boolQuery('isPopular', 'Chỉ lấy điểm đến phổ biến'),
    q('keyword', { type: 'string' }, 'Từ khóa tìm kiếm'),
  ],
});
const categories = crud({
  tag: 'Categories',
  schema: 'Category',
  label: 'danh mục',
  listParams: [q('type', { type: 'string', enum: ['tour', 'teambuilding', 'service', 'event', 'article'] }, 'Lọc theo loại')],
});
const services = crud({
  tag: 'Services',
  schema: 'Service',
  label: 'dịch vụ',
  listParams: [
    q('serviceType', { type: 'string', enum: ['teambuilding', 'amazing_race', 'gala_dinner', 'mice_conference', 'training_workshop', 'year_end_party', 'family_day', 'other'] }),
    boolQuery('isFeatured'),
    q('keyword', { type: 'string' }),
  ],
});
const eventProjects = crud({
  tag: 'Event Projects',
  schema: 'EventProject',
  label: 'sự kiện tiêu biểu',
  listParams: [
    boolQuery('isFeatured'),
    q('keyword', { type: 'string' }),
    q('status', { type: 'string', enum: ['published', 'draft', 'all'], default: 'published' }, 'Chỉ có tác dụng với admin/manager'),
    q('page', { type: 'integer', default: 1 }),
    q('limit', { type: 'integer', default: 12 }),
  ],
});
const galleries = crud({
  tag: 'Galleries',
  schema: 'Gallery',
  label: 'album ảnh',
  listParams: [q('category', { type: 'string' }, 'Category ObjectId'), boolQuery('isFeatured')],
});
const tours = crud({
  tag: 'Tours',
  schema: 'Tour',
  label: 'tour',
  listParams: [
    q('keyword', { type: 'string' }, 'Tìm theo tên, tóm tắt, mã tour'),
    q('destination', { type: 'string' }, 'Destination ObjectId'),
    q('category', { type: 'string' }, 'Category ObjectId'),
    q('minPrice', { type: 'number' }),
    q('maxPrice', { type: 'number' }),
    boolQuery('isFeatured'),
    boolQuery('isHot'),
    q('status', { type: 'string', enum: ['published', 'draft', 'archived', 'all'], default: 'published' }, 'Chỉ có tác dụng với admin/manager'),
    q('page', { type: 'integer', default: 1 }),
    q('limit', { type: 'integer', default: 10 }),
    q('sortBy', { type: 'string', default: 'createdAt' }),
    q('sortOrder', { type: 'string', enum: ['asc', 'desc'], default: 'desc' }),
  ],
});

const seo = {
  type: 'object',
  properties: {
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    metaKeywords: { type: 'array', items: { type: 'string' } },
  },
};
const strArr = { type: 'array', items: { type: 'string' } };
const base = {
  _id: { type: 'string', example: '665f1c2e8b3f4a0012345678' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};
// Schema đầy đủ = Input + các trường hệ thống
const withBase = (input) => ({ allOf: [ref(input), { type: 'object', properties: base }] });

const schemas = {
  User: {
    type: 'object',
    properties: {
      _id: base._id,
      username: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'manager', 'editor', 'sales', 'customer'] },
      avatar: { type: 'string' },
      createdAt: base.createdAt,
    },
  },
  AuthResult: {
    type: 'object',
    properties: { user: ref('User'), token: { type: 'string' } },
  },
  DestinationInput: {
    type: 'object',
    required: ['name', 'slug', 'region', 'country'],
    properties: {
      name: { type: 'string', example: 'Nhật Bản' },
      slug: { type: 'string', example: 'nhat-ban' },
      region: { type: 'string', enum: ['chau-a', 'chau-au', 'chau-my', 'chau-uc', 'chau-phi', 'viet-nam'] },
      country: { type: 'string', example: 'Japan' },
      city: { type: 'string' },
      thumbnail: { type: 'string' },
      banner: { type: 'string' },
      description: { type: 'string' },
      highlights: strArr,
      isPopular: { type: 'boolean' },
      order: { type: 'integer' },
      isActive: { type: 'boolean' },
      seo,
    },
  },
  Destination: withBase('DestinationInput'),
  CategoryInput: {
    type: 'object',
    required: ['name', 'slug', 'type'],
    properties: {
      name: { type: 'string', example: 'Tour châu Á' },
      slug: { type: 'string', example: 'tour-chau-a' },
      type: { type: 'string', enum: ['tour', 'teambuilding', 'service', 'event', 'article'] },
      description: { type: 'string' },
      icon: { type: 'string' },
      image: { type: 'string' },
      parent: { type: 'string', nullable: true, description: 'Category ObjectId' },
      order: { type: 'integer' },
      isActive: { type: 'boolean' },
    },
  },
  Category: withBase('CategoryInput'),
  ServiceInput: {
    type: 'object',
    required: ['title', 'slug'],
    properties: {
      title: { type: 'string', example: 'Teambuilding bãi biển' },
      slug: { type: 'string', example: 'teambuilding-bai-bien' },
      category: { type: 'string', description: 'Category ObjectId' },
      serviceType: { type: 'string', enum: ['teambuilding', 'amazing_race', 'gala_dinner', 'mice_conference', 'training_workshop', 'year_end_party', 'family_day', 'other'] },
      shortDescription: { type: 'string' },
      content: { type: 'string' },
      targetAudience: { type: 'string' },
      suggestedLocations: strArr,
      highlights: strArr,
      thumbnail: { type: 'string' },
      gallery: strArr,
      videoUrl: { type: 'string' },
      order: { type: 'integer' },
      isFeatured: { type: 'boolean' },
      isActive: { type: 'boolean' },
      seo,
    },
  },
  Service: withBase('ServiceInput'),
  EventProjectInput: {
    type: 'object',
    required: ['title', 'slug', 'clientName'],
    properties: {
      title: { type: 'string' },
      slug: { type: 'string' },
      clientName: { type: 'string' },
      clientLogo: { type: 'string' },
      service: { type: 'string', description: 'Service ObjectId' },
      location: { type: 'string' },
      participantsCount: { type: 'integer' },
      eventDate: { type: 'string', format: 'date' },
      overview: { type: 'string' },
      content: { type: 'string' },
      thumbnail: { type: 'string' },
      gallery: strArr,
      videoUrl: { type: 'string' },
      isFeatured: { type: 'boolean' },
      order: { type: 'integer' },
      status: { type: 'string', enum: ['draft', 'published'] },
    },
  },
  EventProject: withBase('EventProjectInput'),
  GalleryInput: {
    type: 'object',
    required: ['title', 'slug'],
    properties: {
      title: { type: 'string' },
      slug: { type: 'string' },
      description: { type: 'string' },
      coverImage: { type: 'string' },
      category: { type: 'string', description: 'Category ObjectId' },
      eventProject: { type: 'string', description: 'EventProject ObjectId' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            title: { type: 'string' },
            caption: { type: 'string' },
            sortOrder: { type: 'integer' },
          },
        },
      },
      isFeatured: { type: 'boolean' },
      order: { type: 'integer' },
      isActive: { type: 'boolean' },
    },
  },
  Gallery: withBase('GalleryInput'),
  TourInput: {
    type: 'object',
    required: ['title', 'destinations'],
    properties: {
      title: { type: 'string', example: 'Tour Nhật Bản 6N5Đ' },
      slug: { type: 'string', description: 'Tự sinh từ title nếu bỏ trống' },
      code: { type: 'string' },
      destinations: { type: 'array', minItems: 1, items: { type: 'string' }, description: 'Destination ObjectIds (ít nhất 1)' },
      categories: { type: 'array', items: { type: 'string' }, description: 'Category ObjectIds' },
      duration: {
        type: 'object',
        properties: { days: { type: 'integer' }, nights: { type: 'integer' }, text: { type: 'string', example: '6 Ngày 5 Đêm' } },
      },
      departureLocation: { type: 'string' },
      departureSchedule: { type: 'string' },
      departureDates: { type: 'array', items: { type: 'string', format: 'date' } },
      price: {
        type: 'object',
        properties: {
          adult: { type: 'number' },
          child: { type: 'number' },
          singleSupplement: { type: 'number' },
          originalPrice: { type: 'number' },
          currency: { type: 'string', default: 'VND' },
        },
      },
      groupSize: { type: 'object', properties: { min: { type: 'integer' }, max: { type: 'integer' } } },
      languages: strArr,
      overview: { type: 'string' },
      highlights: strArr,
      itinerary: {
        type: 'array',
        items: {
          type: 'object',
          required: ['day', 'title', 'content'],
          properties: {
            day: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            meals: strArr,
            accommodation: { type: 'string' },
            image: { type: 'string' },
          },
        },
      },
      inclusions: strArr,
      exclusions: strArr,
      policies: {
        type: 'object',
        properties: {
          cancellation: { type: 'string' },
          terms: { type: 'string' },
          children: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      faqs: {
        type: 'array',
        items: { type: 'object', properties: { question: { type: 'string' }, answer: { type: 'string' } } },
      },
      thumbnail: { type: 'string' },
      gallery: strArr,
      videoUrl: { type: 'string' },
      isFeatured: { type: 'boolean' },
      isHot: { type: 'boolean' },
      status: { type: 'string', enum: ['draft', 'published', 'archived'], default: 'draft' },
      seo: { ...seo, properties: { ...seo.properties, ogImage: { type: 'string' } } },
    },
  },
  Tour: withBase('TourInput'),
  BookingCreate: {
    type: 'object',
    required: ['customer'],
    properties: {
      type: { type: 'string', enum: ['tour_booking', 'teambuilding_request', 'custom_mice', 'consultation'], default: 'tour_booking' },
      tour: { type: 'string', description: 'Tour ObjectId' },
      service: { type: 'string', description: 'Service ObjectId' },
      customer: {
        type: 'object',
        required: ['fullName', 'email', 'phone'],
        properties: {
          fullName: { type: 'string', example: 'Nguyễn Văn A' },
          email: { type: 'string', format: 'email', example: 'a@example.com' },
          phone: { type: 'string', example: '0909123456' },
          companyName: { type: 'string' },
          address: { type: 'string' },
          note: { type: 'string' },
        },
      },
      details: {
        type: 'object',
        properties: {
          departureDate: { type: 'string', format: 'date' },
          returnDate: { type: 'string', format: 'date' },
          adultsCount: { type: 'integer', default: 1 },
          childrenCount: { type: 'integer', default: 0 },
          infantsCount: { type: 'integer', default: 0 },
          participantCount: { type: 'integer', default: 0 },
          destinationPreference: { type: 'string' },
          estimatedBudget: { type: 'string', example: '50 - 100 triệu' },
          specialRequests: { type: 'string' },
        },
      },
    },
  },
  BookingUpdate: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['new', 'contacted', 'processing', 'confirmed', 'completed', 'cancelled'] },
      assignedTo: { type: 'string', description: 'User ObjectId' },
      note: { type: 'string', description: 'Thêm ghi chú chăm sóc khách hàng' },
      pricing: ref('BookingPricing'),
    },
  },
  BookingPricing: {
    type: 'object',
    properties: {
      totalAmount: { type: 'number' },
      depositAmount: { type: 'number' },
      currency: { type: 'string' },
      paymentStatus: { type: 'string', enum: ['pending', 'partial', 'paid', 'refunded'] },
      paymentMethod: { type: 'string', enum: ['unspecified', 'bank_transfer', 'cash', 'vnpay', 'credit_card'] },
    },
  },
  Booking: {
    allOf: [
      ref('BookingCreate'),
      {
        type: 'object',
        properties: {
          ...base,
          code: { type: 'string', example: 'SGT-20261006-1234' },
          status: { type: 'string', enum: ['new', 'contacted', 'processing', 'confirmed', 'completed', 'cancelled'] },
          pricing: ref('BookingPricing'),
          assignedTo: { type: 'string' },
          staffNotes: {
            type: 'array',
            items: {
              type: 'object',
              properties: { staff: { type: 'string' }, note: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' } },
            },
          },
        },
      },
    ],
  },
  Setting: {
    type: 'object',
    properties: {
      companyName: { type: 'string' },
      slogan: { type: 'string' },
      hotline: { type: 'string' },
      phone: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'string' },
      workingHours: { type: 'string' },
      socialLinks: {
        type: 'object',
        properties: {
          facebook: { type: 'string' },
          youtube: { type: 'string' },
          zalo: { type: 'string' },
          instagram: { type: 'string' },
          tiktok: { type: 'string' },
        },
      },
      logo: { type: 'string' },
      favicon: { type: 'string' },
      sliders: {
        type: 'array',
        items: {
          type: 'object',
          required: ['image'],
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string' },
            image: { type: 'string' },
            link: { type: 'string' },
            buttonText: { type: 'string' },
            order: { type: 'integer' },
            isActive: { type: 'boolean' },
          },
        },
      },
      aboutIntro: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          shortDescription: { type: 'string' },
          highlightStats: {
            type: 'array',
            items: { type: 'object', properties: { number: { type: 'string' }, label: { type: 'string' } } },
          },
        },
      },
      footerInfo: { type: 'object', properties: { copyrightText: { type: 'string' }, licenseNumber: { type: 'string' } } },
      seoDefault: {
        type: 'object',
        properties: { metaTitle: { type: 'string' }, metaDescription: { type: 'string' }, ogImage: { type: 'string' } },
      },
    },
  },
  Error: {
    type: 'object',
    properties: { success: { type: 'boolean', example: false }, message: { type: 'string' } },
  },
};

const errorResponse = (description) => ({ description, ...json(ref('Error')) });

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Saigon Travel & Teambuilding API',
    version: '1.0.0',
    description:
      'API phục vụ website Du lịch, Teambuilding, Sự kiện & MICE.\n\n' +
      'Để gọi các API cần quyền: gọi `POST /api/auth/login`, copy `data.token`, bấm nút **Authorize** và dán token vào.',
  },
  servers: [{ url: '/', description: 'Server hiện tại' }],
  tags: [
    { name: 'System' },
    { name: 'Auth', description: 'Đăng ký, đăng nhập' },
    { name: 'Tours', description: 'Tour du lịch' },
    { name: 'Bookings', description: 'Đặt tour / yêu cầu tư vấn' },
    { name: 'Destinations', description: 'Điểm đến & menu châu lục' },
    { name: 'Categories', description: 'Danh mục' },
    { name: 'Services', description: 'Dịch vụ Teambuilding, Gala, MICE' },
    { name: 'Event Projects', description: 'Sự kiện tiêu biểu / Case studies' },
    { name: 'Galleries', description: 'Thư viện ảnh' },
    { name: 'Settings', description: 'Cấu hình website' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    responses: {
      BadRequest: errorResponse('Dữ liệu không hợp lệ'),
      NotFound: errorResponse('Không tìm thấy tài nguyên'),
      Unauthorized: errorResponse('Chưa đăng nhập hoặc token không hợp lệ'),
      Forbidden: errorResponse('Không đủ quyền'),
    },
    schemas,
  },
  paths: {
    '/api/health': {
      get: { tags: ['System'], summary: 'Health check', responses: { 200: { description: 'API đang chạy' } } },
    },

    // ---------- Auth ----------
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký tài khoản',
        requestBody: {
          required: true,
          ...json({
            type: 'object',
            required: ['email', 'username', 'password'],
            properties: {
              email: { type: 'string', format: 'email', example: 'user@example.com' },
              username: { type: 'string', minLength: 3, example: 'user01' },
              password: { type: 'string', minLength: 6, example: '123456' },
              name: { type: 'string' },
              phone: { type: 'string' },
            },
          }),
        },
        responses: { 201: ok(ref('AuthResult'), 'Đăng ký thành công'), 400: { $ref: '#/components/responses/BadRequest' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập bằng username hoặc email',
        requestBody: {
          required: true,
          ...json({
            type: 'object',
            required: ['password'],
            properties: {
              account: { type: 'string', description: 'Username hoặc email (hoặc dùng field username / email)', example: 'admin' },
              username: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string', example: '123456' },
            },
          }),
        },
        responses: {
          200: ok(ref('AuthResult'), 'Đăng nhập thành công'),
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Thông tin tài khoản hiện tại',
        security: secured,
        responses: { 200: ok(ref('User')), ...authResponses },
      },
    },

    // ---------- Tours ----------
    '/api/tours': tours.list,
    '/api/tours/{id}': tours.item,
    '/api/tours/{id}/status': {
      patch: {
        tags: ['Tours'],
        summary: 'Cập nhật nhanh trạng thái / cờ nổi bật / hot',
        security: secured,
        parameters: [idParam],
        requestBody: {
          required: true,
          ...json({
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['draft', 'published', 'archived'] },
              isFeatured: { type: 'boolean' },
              isHot: { type: 'boolean' },
            },
          }),
        },
        responses: { 200: ok(ref('Tour')), ...errorResponses, ...authResponses },
      },
    },
    '/api/tours/{id}/duplicate': {
      post: {
        tags: ['Tours'],
        summary: 'Nhân bản tour (bản sao ở trạng thái nháp)',
        security: secured,
        parameters: [idParam],
        responses: { 201: ok(ref('Tour')), ...errorResponses, ...authResponses },
      },
    },

    // ---------- Bookings ----------
    '/api/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Gửi yêu cầu tư vấn / đặt tour (Public)',
        requestBody: { required: true, ...json(ref('BookingCreate')) },
        responses: {
          201: ok({
            type: 'object',
            properties: { bookingCode: { type: 'string' }, id: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' } },
          }),
          ...errorResponses,
        },
      },
      get: {
        tags: ['Bookings'],
        summary: 'Danh sách booking (nhân viên)',
        security: secured,
        parameters: [
          q('status', { type: 'string', enum: ['new', 'contacted', 'processing', 'confirmed', 'completed', 'cancelled'] }),
          q('type', { type: 'string', enum: ['tour_booking', 'teambuilding_request', 'custom_mice', 'consultation'] }),
          q('keyword', { type: 'string' }, 'Mã booking, họ tên, phone, email, công ty'),
          q('page', { type: 'integer', default: 1 }),
          q('limit', { type: 'integer', default: 10 }),
          q('sortBy', { type: 'string', default: 'createdAt' }),
          q('sortOrder', { type: 'string', enum: ['asc', 'desc'], default: 'desc' }),
        ],
        responses: { 200: ok({ type: 'array', items: ref('Booking') }), ...authResponses },
      },
    },
    '/api/bookings/{id}': {
      get: {
        tags: ['Bookings'],
        summary: 'Chi tiết booking',
        security: secured,
        parameters: [idParam],
        responses: { 200: ok(ref('Booking')), ...errorResponses, ...authResponses },
      },
      patch: {
        tags: ['Bookings'],
        summary: 'Cập nhật trạng thái / gán nhân viên / thêm ghi chú',
        security: secured,
        parameters: [idParam],
        requestBody: { required: true, ...json(ref('BookingUpdate')) },
        responses: { 200: ok(ref('Booking')), ...errorResponses, ...authResponses },
      },
      delete: {
        tags: ['Bookings'],
        summary: 'Xóa booking (Admin/Manager)',
        security: secured,
        parameters: [idParam],
        responses: { 200: ok({ type: 'object' }), ...errorResponses, ...authResponses },
      },
    },

    // ---------- Destinations ----------
    '/api/destinations': destinations.list,
    '/api/destinations/grouped': {
      get: {
        tags: ['Destinations'],
        summary: 'Điểm đến gom nhóm theo châu lục (Mega Menu)',
        responses: {
          200: ok({
            type: 'array',
            items: {
              type: 'object',
              properties: {
                regionKey: { type: 'string' },
                regionName: { type: 'string' },
                items: { type: 'array', items: ref('Destination') },
              },
            },
          }),
        },
      },
    },
    '/api/destinations/{id}': destinations.item,

    // ---------- Categories ----------
    '/api/categories': categories.list,
    '/api/categories/{id}': categories.item,

    // ---------- Services ----------
    '/api/services': services.list,
    '/api/services/{id}': services.item,

    // ---------- Event Projects ----------
    '/api/event-projects': eventProjects.list,
    '/api/event-projects/{id}': eventProjects.item,

    // ---------- Galleries ----------
    '/api/galleries': galleries.list,
    '/api/galleries/{id}': galleries.item,

    // ---------- Settings ----------
    '/api/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Lấy cấu hình website & sliders',
        responses: { 200: ok(ref('Setting')) },
      },
      put: {
        tags: ['Settings'],
        summary: 'Cập nhật cấu hình website (Admin/Manager)',
        security: secured,
        requestBody: { required: true, ...json(ref('Setting')) },
        responses: { 200: ok(ref('Setting')), ...errorResponses, ...authResponses },
      },
    },
  },
};
