const { errorMessages: { WRONG_PASSWORD_OR_EMAIL } } = require('../errors');
const { ErrorHandler, errorMessages } = require('../errors');
const { responseCodesEnum, constants } = require('../constants');
const { User, Oauth } = require('../dataBase');
const { authService: { verifyToken } } = require('../services');

module.exports = {
  getUserByEmail: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, WRONG_PASSWORD_OR_EMAIL.message,
          WRONG_PASSWORD_OR_EMAIL.code);
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  },

  checkToken: (tokenType = constants.ACCESS) => async (req, res, next) => {
    try {
      const token = req.get(constants.AUTHORIZATION);

      if (!token) {
        throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, errorMessages.UN_AUTHORIZED.message,
          errorMessages.UN_AUTHORIZED.code);
      }

      if (tokenType === constants.REFRESH) {
        await verifyToken(token, tokenType);
      } else await verifyToken(token);

      const tokenObject = tokenType === constants.REFRESH ? await Oauth.findOne({ refreshToken: token })
        : await Oauth.findOne({ accessToken: token });

      if (!tokenObject) {
        throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, errorMessages.UN_AUTHORIZED.message,
          errorMessages.UN_AUTHORIZED.code);
      }

      req.user = tokenObject.user;
      next();
    } catch (err) {
      next(err);
    }
  }
};
