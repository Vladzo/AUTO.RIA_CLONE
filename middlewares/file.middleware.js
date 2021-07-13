const { ErrorHandler, errorMessages: { WRONG_FILE_FORMAT, TOO_BIG_FILE } } = require('../errors');
const { constants: { PHOTOS_MIMETYPES, PHOTO_MAX_SIZE }, responseCodesEnum } = require('../constants');

module.exports = {
  checkPhoto: (req, res, next) => {
    try {
      const [avatar] = Object.values(req.files);

      if (!PHOTOS_MIMETYPES.includes(avatar.mimetype)) {
        throw new ErrorHandler(responseCodesEnum.NOT_ALLOWED, WRONG_FILE_FORMAT.message, WRONG_FILE_FORMAT.code);
      }

      if (avatar.size > PHOTO_MAX_SIZE) {
        throw new ErrorHandler(responseCodesEnum.NOT_ALLOWED, TOO_BIG_FILE.message, TOO_BIG_FILE.code);
      }

      req.avatar = avatar;
      next();
    } catch (err) {
      next(err);
    }
  }
};
