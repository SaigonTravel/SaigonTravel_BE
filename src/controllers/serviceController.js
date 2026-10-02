const { Service } = require('../models');

/**
 * @desc    Lấy danh sách các dịch vụ Teambuilding & Sự kiện
 * @route   GET /api/services
 * @access  Public
 */
exports.getServices = async (req, res, next) => {
  try {
    const { serviceType, isFeatured, keyword } = req.query;
    const query = { isActive: true };

    if (serviceType) {
      query.serviceType = serviceType;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { shortDescription: { $regex: keyword, $options: 'i' } },
      ];
    }

    const services = await Service.find(query)
      .populate('category', 'name slug')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết dịch vụ theo slug hoặc id
 * @route   GET /api/services/:identifier
 * @access  Public
 */
exports.getServiceDetail = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const service = await Service.findOne(query).populate('category', 'name slug');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ yêu cầu',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo dịch vụ mới (Admin)
 * @route   POST /api/services
 * @access  Private (Admin)
 */
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo dịch vụ thành công',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật dịch vụ (Admin)
 * @route   PUT /api/services/:id
 * @access  Private (Admin)
 */
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật dịch vụ thành công', data: service });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa dịch vụ (Admin)
 * @route   DELETE /api/services/:id
 * @access  Private (Admin)
 */
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dịch vụ' });
    }
    res.status(200).json({ success: true, message: 'Xóa dịch vụ thành công' });
  } catch (error) {
    next(error);
  }
};
