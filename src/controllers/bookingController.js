const { Booking, Tour, Service } = require('../models');

/**
 * @desc    Tạo yêu cầu tư vấn / Đặt giữ chỗ Tour / Yêu cầu Teambuilding
 * @route   POST /api/bookings
 * @access  Public
 */
exports.createBooking = async (req, res, next) => {
  try {
    const {
      type = 'tour_booking',
      tour,
      service,
      customer,
      details,
    } = req.body;

    // Validate thông tin bắt buộc của khách hàng
    if (!customer || !customer.fullName || !customer.phone || !customer.email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: Họ tên, Số điện thoại và Email liên hệ',
      });
    }

    // Nếu chọn tour, kiểm tra tour có tồn tại không
    if (tour) {
      const tourExists = await Tour.findById(tour);
      if (!tourExists) {
        return res.status(404).json({
          success: false,
          message: 'Tour du lịch được chọn không tồn tại trong hệ thống',
        });
      }
    }

    // Nếu chọn service, kiểm tra service có tồn tại không
    if (service) {
      const serviceExists = await Service.findById(service);
      if (!serviceExists) {
        return res.status(404).json({
          success: false,
          message: 'Dịch vụ được chọn không tồn tại trong hệ thống',
        });
      }
    }

    // Tạo booking mới
    const newBooking = await Booking.create({
      type,
      tour: tour || null,
      service: service || null,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
        companyName: customer.companyName ? customer.companyName.trim() : '',
        address: customer.address ? customer.address.trim() : '',
        note: customer.note || '',
      },
      details: {
        departureDate: details?.departureDate ? new Date(details.departureDate) : null,
        returnDate: details?.returnDate ? new Date(details.returnDate) : null,
        adultsCount: Number(details?.adultsCount) || 1,
        childrenCount: Number(details?.childrenCount) || 0,
        infantsCount: Number(details?.infantsCount) || 0,
        participantCount: Number(details?.participantCount) || 0,
        destinationPreference: details?.destinationPreference || '',
        estimatedBudget: details?.estimatedBudget || '',
        specialRequests: details?.specialRequests || '',
      },
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Gửi yêu cầu thành công! Đội ngũ tư vấn Saigon Travel sẽ liên hệ với bạn trong thời gian sớm nhất.',
      data: {
        bookingCode: newBooking.code,
        id: newBooking._id,
        createdAt: newBooking.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách các yêu cầu (Dành cho Admin/Staff/Sales)
 * @route   GET /api/bookings
 * @access  Private (Staff/Sales/Admin)
 */
exports.getBookings = async (req, res, next) => {
  try {
    const {
      status,
      type,
      keyword,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Lọc theo trạng thái
    if (status) {
      query.status = status;
    }

    // Lọc theo loại yêu cầu
    if (type) {
      query.type = type;
    }

    // Tìm kiếm theo từ khóa (Mã booking, họ tên, phone, email, tên công ty)
    if (keyword) {
      query.$or = [
        { code: { $regex: keyword, $options: 'i' } },
        { 'customer.fullName': { $regex: keyword, $options: 'i' } },
        { 'customer.phone': { $regex: keyword, $options: 'i' } },
        { 'customer.email': { $regex: keyword, $options: 'i' } },
        { 'customer.companyName': { $regex: keyword, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('tour', 'title code thumbnail duration price')
        .populate('service', 'title serviceType')
        .populate('assignedTo', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xem chi tiết một yêu cầu booking
 * @route   GET /api/bookings/:id
 * @access  Private
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tour')
      .populate('service')
      .populate('assignedTo', 'name email phone')
      .populate('staffNotes.staff', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu tư vấn với ID này',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật trạng thái / Gán nhân viên tư vấn / Thêm ghi chú chăm sóc khách hàng
 * @route   PATCH /api/bookings/:id
 * @access  Private
 */
exports.updateBooking = async (req, res, next) => {
  try {
    const { status, assignedTo, note, pricing } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu cần cập nhật',
      });
    }

    if (status) {
      booking.status = status;
    }

    if (assignedTo) {
      booking.assignedTo = assignedTo;
    }

    if (pricing) {
      booking.pricing = {
        ...booking.pricing,
        ...pricing,
      };
    }

    // Thêm ghi chú lịch sử tư vấn của nhân viên
    if (note) {
      booking.staffNotes.push({
        staff: req.user._id,
        note: note.trim(),
        createdAt: new Date(),
      });
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật yêu cầu tư vấn thành công',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa yêu cầu booking
 * @route   DELETE /api/bookings/:id
 * @access  Private (Admin only)
 */
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu để xóa',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa yêu cầu thành công',
    });
  } catch (error) {
    next(error);
  }
};
