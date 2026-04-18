// Application constants

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const PROJECT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
};

const MESSAGE_STATUS = {
  NEW: 'new',
  READ: 'read',
  REPLIED: 'replied',
  ARCHIVED: 'archived'
};

const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
};

const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_URL: 'Please provide a valid URL',
  INVALID_ID: 'Invalid ID format'
};

const AUTH = {
  SALT_ROUNDS: 10,
  TOKEN_EXPIRE: '7d',
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  PASSWORD_MIN: 6,
};

module.exports = {
  HTTP_STATUS,
  PROJECT_STATUS,
  MESSAGE_STATUS,
  PAGINATION_DEFAULTS,
  VALIDATION_MESSAGES,
  AUTH
};