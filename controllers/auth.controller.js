const { Oauth } = require('../dataBase');
const { responseCodesEnum, constants } = require('../constants');
const { passwordHasher, userHelper } = require('../helpers');
const { authService } = require('../services');

module.exports = {
  login: async (req, res, next) => {
    try {
      const { password: hashedPassword, _id } = req.user;
      const { password } = req.body;

      await passwordHasher.compare(hashedPassword, password);

      const tokenPair = authService.getTokenPair();

      await Oauth.remove({ user: _id });

      const createdUser = await Oauth.create({ ...tokenPair, user: _id });

      const normalizedUser = userHelper.userNormalizator(createdUser.toObject());

      res.json({
        ...tokenPair,
        user: normalizedUser
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const token = req.get(constants.AUTHORIZATION);

      await Oauth.remove({ accessToken: token });

      res.status(responseCodesEnum.NO_CONTENT).json(constants.NO_CONTENT);
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { _id } = req.user;
      const token = req.get(constants.AUTHORIZATION);

      await Oauth.remove({ refreshToken: token });

      const tokenPair = authService.getTokenPair();

      await Oauth.create({ ...tokenPair, user: _id });

      res.json({
        ...tokenPair, user: _id
      });
    } catch (err) {
      next(err);
    }
  }
};
