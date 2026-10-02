const { Destination, Tour } = require('../models');

/**
 * @desc    Lấy danh sách điểm đến (có hỗ trợ lọc theo region, isPopular, keyword)
 * @route   GET /api/destinations
 * @access  Public
 */
exports.getDestinations = async (req, res, next) => {
  try {
    const { region, isPopular, keyword } = req.query;
    const query = { isActive: true };

    if (region) {
      query.region = region;
    }

    if (isPopular !== undefined) {
      query.isPopular = isPopular === 'true';
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { country: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } },
      ];
    }

    const destinations = await Destination.find(query).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách điểm đến được gom nhóm theo Châu lục (Phục vụ Mega Menu)
 * @route   GET /api/destinations/grouped
 * @access  Public
 */
exports.getGroupedDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ isActive: true }).sort({ order: 1, name: 1 });

    const regionNames = {
      'chau-a': 'Châu Á',
      'chau-au': 'Châu Âu',
      'chau-my': 'Châu Mỹ',
      'chau-uc': 'Châu Úc',
      'chau-phi': 'Châu Phi',
      'viet-nam': 'Việt Nam',
    };

    const grouped = {
      'chau-a': { regionKey: 'chau-a', regionName: regionNames['chau-a'], items: [] },
      'chau-au': { regionKey: 'chau-au', regionName: regionNames['chau-au'], items: [] },
      'chau-my': { regionKey: 'chau-my', regionName: regionNames['chau-my'], items: [] },
      'chau-uc': { regionKey: 'chau-uc', regionName: regionNames['chau-uc'], items: [] },
      'chau-phi': { regionKey: 'chau-phi', regionName: regionNames['chau-phi'], items: [] },
      'viet-nam': { regionKey: 'viet-nam', regionName: regionNames['viet-nam'], items: [] },
    };

    destinations.forEach((dest) => {
      if (grouped[dest.region]) {
        grouped[dest.region].items.push(dest);
      }
    });

    res.status(200).json({
      success: true,
      data: Object.values(grouped).filter((g) => g.items.length > 0),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết một điểm đến theo slug hoặc ID kèm danh sách Tour
 * @route   GET /api/destinations/:identifier
 * @access  Public
 */
exports.getDestinationDetail = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const destination = await Destination.findOne(query);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy điểm đến yêu cầu',
      });
    }

    // Lấy các tour thuộc điểm đến này
    const tours = await Tour.find({
      destinations: destination._id,
      status: 'published',
    }).select('title slug code duration price thumbnail highlights rating isFeatured');

    res.status(200).json({
      success: true,
      data: {
        destination,
        tours,
        totalTours: tours.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo điểm đến mới (Admin)
 * @route   POST /api/destinations
 * @access  Private (Admin)
 */
exports.createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo điểm đến thành công',
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật điểm đến (Admin)
 * @route   PUT /api/destinations/:id
 * @access  Private (Admin)
 */
exports.updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy điểm đến' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật điểm đến thành công', data: destination });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa điểm đến (Admin)
 * @route   DELETE /api/destinations/:id
 * @access  Private (Admin)
 */
exports.deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy điểm đến' });
    }
    res.status(200).json({ success: true, message: 'Xóa điểm đến thành công' });
  } catch (error) {
    next(error);
  }
};
