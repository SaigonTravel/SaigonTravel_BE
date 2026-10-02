const { User } = require('../models');

/**
 * @desc    Đăng ký tài khoản mới (Register)
 * @route   POST /api/auth/register
 * @access  Public
 * @body    { email, username, password, name?, phone? }
 */
exports.register = async (req, res, next) => {
  try {
    const { email, username, password, name, phone } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ email, username và password',
      });
    }

    // Kiểm tra trùng lặp email hoặc username
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.toLowerCase().trim() },
      ],
    });

    if (existingUser) {
      const isEmailDup = existingUser.email === email.toLowerCase().trim();
      return res.status(400).json({
        success: false,
        message: isEmailDup
          ? 'Email này đã được sử dụng'
          : 'Username này đã được sử dụng, vui lòng chọn tên khác',
      });
    }

    // Tạo user mới
    const user = await User.create({
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      password,
      name: name || username,
      phone: phone || '',
    });

    // Tạo JWT Token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Đăng nhập (Login bằng username HOẶC email)
 * @route   POST /api/auth/login
 * @access  Public
 * @body    { username/email/account, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { password } = req.body;
    // Chấp nhận key 'account', 'username' hoặc 'email' từ request body
    const loginIdentifier = req.body.account || req.body.username || req.body.email;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tài khoản (username hoặc email) và mật khẩu',
      });
    }

    const cleanIdentifier = loginIdentifier.toLowerCase().trim();

    // Tìm kiếm người dùng bằng email hoặc username (kèm password vì mặc định password select: false)
    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }

    // Kiểm tra tài khoản có bị khoá không
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ quản trị viên.',
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }

    // Cập nhật thời điểm đăng nhập gần nhất
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Tạo JWT Token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy thông tin người dùng đang đăng nhập
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
