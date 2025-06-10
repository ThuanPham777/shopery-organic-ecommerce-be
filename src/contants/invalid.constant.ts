export const INVALID_MIN = (n: number) => `Must be at least ${n} characters`;
export const INVALID_MAX = (n: number) => `Must not exceed ${n} characters`;
export const INVALID_LENGHT = (n: number) => `Must be exactly ${n} characters`;
export const INVALID_EMAIL = `Invalid email address`;
export const INVALID_STRING = `Must be a string`;
export const INVALID_NUMBER_STRING = `Must contain digits only`;
export const INVALID_NUMBER = `Value must be a number`;
export const INVALID_DATE = `Invalid date`;
export const INVALID_UUID = `Must be in UUID format`;
export const INVALID_ARRAY = `Value must be an array`;
export const INVALID_PASSWORD = `Password must be at least 8 characters long, and include at least 1 uppercase letter, 1 lowercase letter, and 1 number`;
export const INVALID_ENUM = (values: string[]) =>
  `Must be one of the following: ${values.join(', ')}`;
export const INVALID_REQUIRED = 'This field is required';
export const INVALID_MATCH = (pattern: string) =>
  `Must match the pattern: ${pattern}`;
export const INVALID_MIN_LENGTH = (n: number) => `Must be at least ${n} characters`;
export const INVALID_PHONE_NUMBER = 'Phone number must be 10 digits and start with 0';
