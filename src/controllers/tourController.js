const { Tour } = require('../models');

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
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = { status: 'published' };

    // Tìm kiếm từ khóa theo tên hoặc tóm tắt
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
