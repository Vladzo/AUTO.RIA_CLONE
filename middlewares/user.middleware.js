const { User, Oauth } = require('../dataBase');
const { responseCodesEnum, constants } = require('../constants');
const {
  ErrorHandler, errorMessages: {
    RECORD_NOT_FOUND, CANT_REGISTER, IN_VALID, UN_AUTHORIZED
  }
} = require('../errors');
const {
  userValidator, loginValidator, updateValidator, userIdValidator
} = require('../validators');
const { authService: { verifyToken } } = require('../services');

module.exports = {
  checkToken: async (req, res, next) => {
    try {
      const token = req.get(constants.AUTHORIZATION);

      if (!token) {
        throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, UN_AUTHORIZED.message,
          UN_AUTHORIZED.code);
      }

      await verifyToken(token);

      const tokenObject = await Oauth.findOne({ accessToken: token });

      if (!tokenObject || req.user._id.toString() !== tokenObject.user._id.toString()) {
        throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, UN_AUTHORIZED.message,
          UN_AUTHORIZED.code);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  getUserByParam: (param, searchIn, dbField = param) => async (req, res, next) => {
    try {
      const value = req[searchIn][param];

      const user = await User.findOne({ [dbField]: value });

      if (!user) {
        throw new ErrorHandler(responseCodesEnum.NOT_FOUND, RECORD_NOT_FOUND.message, RECORD_NOT_FOUND.code);
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  },

  checkUserValidity: (req, res, next) => {
    try {
      const { error } = userValidator.createUser.validate(req.body);

      if (error) {
        throw new ErrorHandler(responseCodesEnum.NOT_ALLOWED, error.details[0].message, IN_VALID.code);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  loginValidity: (req, res, next) => {
    try {
      const { error } = loginValidator.createUser.validate(req.body);

      if (error) {
        throw new ErrorHandler(responseCodesEnum.NOT_ALLOWED, error.details[0].message, IN_VALID.code);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  updateValidity: (req, res, next) => {
    try {
      const { error } = updateValidator.createUser.validate(req.body);

      if (error) {
        throw new ErrorHandler(responseCodesEnum.NOT_ALLOWED, error.details[0].message, IN_VALID.code);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  checkUserIdValidity: (req, res, next) => {
    try {
      const { error } = userIdValidator.createUser.validate({ id: req.params.userId });

      if (error) {
        throw new ErrorHandler(responseCodesEnum.NOT_ALLOWED, error.details[0].message, IN_VALID.code);
      }

      next();
    } catch (err) {
      next(err);
    }
  },

  canUserRegister: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        throw new ErrorHandler(responseCodesEnum.NOT_ALLOWED, CANT_REGISTER.message, CANT_REGISTER.code);
      }

      next();
    } catch (err) {
      next(err);
    }
  }
};
