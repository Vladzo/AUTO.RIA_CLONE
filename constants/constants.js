module.exports = {
  AUTHORIZATION: 'Authorization',
  HOST_NAME: 'http://localhost:3000',
  PORT: process.env.PORT || 5000,
  UNKNOWN_ERROR: 'Unknown error',
  ROUTE_NOT_FOUND: 'Rout not fond',
  DB: process.env.DB_CONNECTION_URL || 'mongodb://localhost:27017/app',
  ACCESS_SECRET_KEY: process.env.ACCESS_TOKEN_KEY || 'xxxx',
  REFRESH_SECRET_KEY: process.env.REFRESH_TOKEN_KEY || 'yyyy',
  SALT: 10,
  DELETE_ANSWER: 'User has been deleted!',
  UPDATE_ANSWER: 'User has been updated!',
  NO_CONTENT: 'NO CONTENT!',
  REFRESH: 'refresh',
  ACCESS: 'access',
  ACCESS_TOKEN_TIME: '40m',
  REFRESH_TOKEN_TIME: '10d',
  EMAIL: process.env.SERVICE_EMAIL || 'fsdssd@ef',
  EMAIL_PASSWORD: process.env.SERVICE_EMAIL_PASSWORD || '123',

  PHOTO_MAX_SIZE: 4 * 1024 * 1024, // 4MB
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_MAX_SIZE: 20 * 1024 * 1024, // 20MB

  PHOTOS_MIMETYPES: [
    'image/gif',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/tiff',
    'image/webp'
  ],

  DOCS_MIMETYPES: [
    'application/msword', // DOC
    'application/pdf', // PDF
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLS
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOC 2007
  ],

  VIDEOS_MIMETYPES: [
    'video/mpeg',
    'video/mp4',
  ]
};
