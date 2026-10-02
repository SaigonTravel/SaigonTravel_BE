const { Category } = require('../models');

/**
 * @desc    Lấy danh sách các danh mục (hỗ trợ lọc theo type: tour, teambuilding, service, article)
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };

    if (type) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết danh mục theo slug hoặc id
 * @route   GET /api/categories/:identifier
 * @access  Public
 */
exports.getCategoryDetail = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const category = await Category.findOne(query);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo danh mục mới (Admin)
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật danh mục (Admin)
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công', data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa danh mục (Admin)
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    res.status(200).json({ success: true, message: 'Xóa danh mục thành công' });
  } catch (error) {
    next(error);
  }
};
