const MAX_ATTEMPTS = 10;

const randomDigits = (length) => {
  const min = 10 ** (length - 1);
  return String(Math.floor(min + Math.random() * 9 * min));
};

/**
 * Sinh mã ngẫu nhiên chưa tồn tại trong collection (kiểm tra trước khi lưu).
 * Unique index trên field vẫn là chốt chặn cuối nếu 2 request trùng mã cùng lúc.
 * @param {mongoose.Model} Model
 * @param {string} prefix   e.g. 'SGT-' hoặc 'SGT-20261006-'
 * @param {number} length   Số chữ số ngẫu nhiên
 * @param {string} field    Tên field chứa mã
 */
const generateUniqueCode = async (Model, prefix, length = 4, field = 'code') => {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const code = `${prefix}${randomDigits(length)}`;
    if (!(await Model.exists({ [field]: code }))) {
      return code;
    }
  }
  throw new Error(`Không thể sinh mã duy nhất cho ${Model.modelName} sau ${MAX_ATTEMPTS} lần thử`);
};

module.exports = generateUniqueCode;
