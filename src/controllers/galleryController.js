const { Gallery } = require('../models');

/**
 * @desc    Lấy danh sách các album ảnh / media (phục vụ hiển thị Lightbox)
 * @route   GET /api/galleries
 * @access  Public
 */
exports.getGalleries = async (req, res, next) => {
  try {
    const { category, isFeatured } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    const galleries = await Gallery.find(query)
      .populate('category', 'name slug')
      .populate('eventProject', 'title slug clientName')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết album ảnh theo slug hoặc ID kèm danh sách ảnh phóng to lightbox
 * @route   GET /api/galleries/:identifier
 * @access  Public
 */
exports.getGalleryDetail = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const gallery = await Gallery.findOne(query)
      .populate('category', 'name slug')
      .populate('eventProject', 'title slug clientName');

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy album ảnh yêu cầu',
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo album ảnh mới (Admin)
 * @route   POST /api/galleries
 * @access  Private (Admin)
 */
exports.createGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo album ảnh thành công',
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật album ảnh (Admin)
 * @route   PUT /api/galleries/:id
 * @access  Private (Admin)
 */
exports.updateGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy album ảnh' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật album ảnh thành công', data: gallery });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa album ảnh (Admin)
 * @route   DELETE /api/galleries/:id
 * @access  Private (Admin)
 */
exports.deleteGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy album ảnh' });
    }
    res.status(200).json({ success: true, message: 'Xóa album ảnh thành công' });
  } catch (error) {
    next(error);
  }
};
