const slugify = require('slugify');
const { Tour, Destination, Category } = require('../models');

/**
 * @desc    Lấy danh sách tours (Hỗ trợ lọc, tìm kiếm, phân trang)
 * @route   GET /api/tours
 * @access  Public
 */
exports.getTours = async (req, res, next) => {
  try {
    const {
      keyword,
      destination,
      category,
      minPrice,
      maxPrice,
      isFeatured,
      isHot,
      status = 'published',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Nếu có truyền status cụ thể hoặc mặc định là published (nếu là 'all' thì không lọc status)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Tìm kiếm từ khóa theo tên hoặc tóm tắt hoặc mã tour
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { overview: { $regex: keyword, $options: 'i' } },
        { code: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Lọc theo điểm đến
    if (destination) {
      query.destinations = destination;
    }

    // Lọc theo danh mục
    if (category) {
      query.categories = category;
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      query['price.adult'] = {};
      if (minPrice) query['price.adult'].$gte = Number(minPrice);
      if (maxPrice) query['price.adult'].$lte = Number(maxPrice);
    }

    // Lọc nổi bật / hot
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    if (isHot !== undefined) {
      query.isHot = isHot === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [tours, total] = await Promise.all([
      Tour.find(query)
        .populate('destinations', 'name slug region country city thumbnail')
        .populate('categories', 'name slug type')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Tour.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: tours.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: tours,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết một tour theo slug hoặc id
 * @route   GET /api/tours/:identifier
 * @access  Public
 */
exports.getTourDetail = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    // Tìm kiếm theo slug hoặc _id
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const tour = await Tour.findOne(query)
      .populate('destinations', 'name slug region country city thumbnail description highlights')
      .populate('categories', 'name slug type');

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tour du lịch yêu cầu',
      });
    }

    // Tăng lượt xem (không chặn luồng trả lời)
    Tour.findByIdAndUpdate(tour._id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo tour du lịch mới
 * @route   POST /api/tours
 * @access  Private (Admin / Manager)
 */
exports.createTour = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      code,
      destinations,
      categories,
      duration,
      departureLocation,
      departureSchedule,
      departureDates,
      price,
      groupSize,
      languages,
      overview,
      highlights,
      itinerary,
      inclusions,
      exclusions,
      policies,
      faqs,
      thumbnail,
      gallery,
      videoUrl,
      isFeatured,
      isHot,
      status,
      seo,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tiêu đề tour (title)',
      });
    }

    if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất một điểm đến (destinations)',
      });
    }

    // Tự sinh slug nếu không truyền
    let generatedSlug = slug;
    if (!generatedSlug) {
      generatedSlug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    }

    // Kiểm tra trùng slug
    const existingTour = await Tour.findOne({ slug: generatedSlug });
    if (existingTour) {
      generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Tự sinh mã tour nếu không truyền
    let tourCode = code;
    if (!tourCode) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      tourCode = `SGT-${rand}`;
    }

    const newTour = await Tour.create({
      title: title.trim(),
      slug: generatedSlug,
      code: tourCode.toUpperCase().trim(),
      destinations,
      categories: categories || [],
      duration: duration || { days: 1, nights: 0, text: '1 Ngày' },
      departureLocation: departureLocation || 'TP. Hồ Chí Minh',
      departureSchedule: departureSchedule || '',
      departureDates: departureDates || [],
      price: price || { adult: 0, child: 0, currency: 'VND' },
      groupSize: groupSize || { min: 1, max: 50 },
      languages: languages || ['Tiếng Việt'],
      overview: overview || '',
      highlights: highlights || [],
      itinerary: itinerary || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      policies: policies || {},
      faqs: faqs || [],
      thumbnail: thumbnail || '',
      gallery: gallery || [],
      videoUrl: videoUrl || '',
      isFeatured: !!isFeatured,
      isHot: !!isHot,
      status: status || 'published',
      seo: seo || {},
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tour du lịch thành công',
      data: newTour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật thông tin tour du lịch
 * @route   PUT /api/tours/:id
 * @access  Private (Admin / Manager)
 */
exports.updateTour = async (req, res, next) => {
  try {
    const { id } = req.params;

    let tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tour du lịch cần cập nhật',
      });
    }

    // Nếu có cập nhật title và không truyền slug thì cập nhật lại slug
    if (req.body.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true, locale: 'vi' });
    }

    tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('destinations', 'name slug region country city thumbnail')
      .populate('categories', 'name slug type');

    res.status(200).json({
      success: true,
      message: 'Cập nhật tour du lịch thành công',
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa tour du lịch
 * @route   DELETE /api/tours/:id
 * @access  Private (Admin only)
 */
exports.deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tour du lịch để xóa',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa tour du lịch thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật nhanh trạng thái hoặc gắn cờ nổi bật/hot
 * @route   PATCH /api/tours/:id/status
 * @access  Private (Admin / Manager)
 */
exports.updateTourStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isFeatured, isHot } = req.body;

    const updateFields = {};
    if (status !== undefined) {
      if (!['published', 'draft', 'archived'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái status không hợp lệ (hỗ trợ: published, draft, archived)',
        });
      }
      updateFields.status = status;
    }
    if (isFeatured !== undefined) updateFields.isFeatured = !!isFeatured;
    if (isHot !== undefined) updateFields.isHot = !!isHot;

    const tour = await Tour.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tour du lịch yêu cầu',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái tour thành công',
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Nhân bản một tour có sẵn (Duplicate Tour)
 * @route   POST /api/tours/:id/duplicate
 * @access  Private (Admin / Manager)
 */
exports.duplicateTour = async (req, res, next) => {
  try {
    const { id } = req.params;

    const originalTour = await Tour.findById(id).lean();
    if (!originalTour) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tour gốc để nhân bản',
      });
    }

    delete originalTour._id;
    delete originalTour.createdAt;
    delete originalTour.updatedAt;

    const newTitle = `${originalTour.title} (Bản sao)`;
    const newSlug = `${originalTour.slug}-copy-${Date.now().toString().slice(-4)}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newCode = `SGT-${rand}`;

    const duplicatedTour = await Tour.create({
      ...originalTour,
      title: newTitle,
      slug: newSlug,
      code: newCode,
      status: 'draft', // Mặc định bản sao ở trạng thái nháp
      isFeatured: false,
      isHot: false,
      viewCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Nhân bản tour thành công (trạng thái Nháp)',
      data: duplicatedTour,
    });
  } catch (error) {
    next(error);
  }
};

