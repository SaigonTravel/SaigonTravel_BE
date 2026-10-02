const { EventProject } = require('../models');

/**
 * @desc    Lấy danh sách các sự kiện tiêu biểu / Case Studies (Phong cách YanTB)
 * @route   GET /api/event-projects
 * @access  Public
 */
exports.getEventProjects = async (req, res, next) => {
  try {
    const { isFeatured, keyword, page = 1, limit = 12 } = req.query;
    const query = { status: 'published' };

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { clientName: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      EventProject.find(query)
        .populate('service', 'title slug serviceType')
        .sort({ order: 1, eventDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      EventProject.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xem chi tiết sự kiện tiêu biểu theo slug hoặc id
 * @route   GET /api/event-projects/:identifier
 * @access  Public
 */
exports.getEventProjectDetail = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const project = await EventProject.findOne(query).populate('service', 'title slug serviceType');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sự kiện tiêu biểu yêu cầu',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo sự kiện tiêu biểu mới (Admin)
 * @route   POST /api/event-projects
 * @access  Private (Admin)
 */
exports.createEventProject = async (req, res, next) => {
  try {
    const project = await EventProject.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo sự kiện tiêu biểu thành công',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật sự kiện tiêu biểu (Admin)
 * @route   PUT /api/event-projects/:id
 * @access  Private (Admin)
 */
exports.updateEventProject = async (req, res, next) => {
  try {
    const project = await EventProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện tiêu biểu' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật thành công', data: project });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa sự kiện tiêu biểu (Admin)
 * @route   DELETE /api/event-projects/:id
 * @access  Private (Admin)
 */
exports.deleteEventProject = async (req, res, next) => {
  try {
    const project = await EventProject.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện tiêu biểu' });
    }
    res.status(200).json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    next(error);
  }
};
