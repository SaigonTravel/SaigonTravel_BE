const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware xác thực JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để truy cập tài nguyên này',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'saigontravel_secret_fallback'
    );

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản liên kết với token này không còn tồn tại',
      });
    }

    if (!currentUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa',
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    });
  }
};

// Middleware phân quyền theo role (admin, manager, sales...)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Quyền '${req.user.role}' không được phép thực hiện hành động này`,
      });
    }
    next();
  };
};
