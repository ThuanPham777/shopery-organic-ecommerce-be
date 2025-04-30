export class ErrorResponse {
  code: string;
  message: string;

  constructor({ code, message }) {
    this.code = code;
    this.message = message;
  }
}

export const NOT_FOUND = new ErrorResponse({
  code: 'NOT_FOUND',
  message: 'Không tìm thấy!',
});

export const INCORRECT_INPUT = new ErrorResponse({
  code: 'INCORRECT_INPUT',
  message: 'Lỗi dữ liệu không hợp lệ',
});
export const OLD_PASSWORD_SAME_AS_NEW = new ErrorResponse({
  code: 'OLD_PASSWORD_SAME_AS_NEW',
  message: 'Mật khẩu cũ không thể trùng với mật khẩu mới',
});
export const UNAUTHORIZED = new ErrorResponse({
  code: 'UNAUTHORIZED',
  message: 'Lỗi xác thực',
});

export const UNKNOWN_ERROR = new ErrorResponse({
  code: 'UNKNOWN_ERROR',
  message: 'lỗi không xác định',
});
export const INVALID_USER = new ErrorResponse({
  code: 'INVALID_USER',
  message: 'Tài khoản không tồn tại',
});
export const PASSWORD_NOT_MATCH = new ErrorResponse({
  code: 'PASSWORD_NOT_MATCH',
  message: 'Mật khẩu không chính xác',
});

export const USER_NOT_FOUND = new ErrorResponse({
  code: 'USER_NOT_FOUND',
  message: 'Không tìm thấy tài khoản!',
});

export const CHANGE_PASSWORD_FAILED = new ErrorResponse({
  code: 'CHANGE_PASSWORD_FAILED',
  message: 'Thay đổi mật khẩu thất bại!',
});

export const USER_BANNED = new ErrorResponse({
  code: 'USER_BANNED',
  message: 'Tài khoản của bạn đã bị cấm đăng nhập!',
});

export const USER_LOCKED = new ErrorResponse({
  code: 'USER_LOCKED',
  message:
    'Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên để mở lại!',
});
export const FORBIDDEN_EXCEPTION = new ErrorResponse({
  code: 'FORBIDDEN_EXCEPTION',
  message: 'Tài khoản của bạn không đủ quyền',
});
export const USERNAME_ALREADY_EXISTS = new ErrorResponse({
  code: 'USERNAME_ALREADY_EXISTS',
  message: 'Tên người dùng đã tồn tại',
});
export const EXPIRED_TOKEN = new ErrorResponse({
  code: 'EXPIRED_TOKEN',
  message: 'Phiên đăng nhập hết hạn',
});
