export const INVALID_MIN = (n: number) => `Phải tối thiểu ${n} ký tự`;
export const INVALID_MAX = (n: number) => `Không được vượt quá ${n} ký tự`;
export const INVALID_LENGHT = (n: number) => `Phải chính xác ${n} ký tự`;
export const INVALID_EMAIL = `Email không hợp lệ`;
export const INVALID_STRING = `Phải là dạng chuỗi`;
export const INVALID_NUMBER_STRING = `Chỉ bao gồm các chữ số`;
export const INVALID_NUMBER = `Giá trị phải là số`;
export const INVALID_DATE = `Ngày không hợp lệ`;
export const INVALID_UUID = `Phải có định dạng UUID`;
export const INVALID_ARRAY = `Giá trị phải là một mảng`;
export const INVALID_PASSWORD = `Mật khẩu phải có độ dài ít nhất 8 kí tự; chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số`;
export const INVALID_ENUM = (values: string[]) =>
  `Phải là một trong các lựa chọn: ${values.join(', ')}`;
export const INVALID_REQUIRED = 'Không được để trống';
export const INVALID_MATCH = (pattern: string) =>
  `Phải có định dạng hợp lệ: ${pattern}`;
export const INVALID_MIN_LENGTH = (n: number) => `Phải có ít nhất ${n} ký tự`;
