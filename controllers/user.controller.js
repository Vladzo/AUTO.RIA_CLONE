const path = require('path');
const fs = require('fs');
const util = require('util');
const { authService } = require('../services');

const { emailActionEnums } = require('../constants');
const { mailService } = require('../services');
const { User, Avatar, Oauth } = require('../dataBase');
const { responseCodesEnum, constants } = require('../constants');
const { ErrorHandler, errorMessages: { CANT_UPLOAD_FILE, UN_AUTHORIZED } } = require('../errors');
const { passwordHasher, photoHelper, userHelper } = require('../helpers');

const mkDirPromise = util.promisify(fs.mkdir);

module.exports = {
  changePassword: async (req, res, next) => {
    try {
      const { userId, token } = req.params;
      const { password } = req.body;

      const { user: { _id } } = await Oauth.findOne({ accessToken: token });

      if (userId.toString() !== _id.toString()) {
        throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, UN_AUTHORIZED.message, UN_AUTHORIZED.code);
      }

      const hashedPassword = await passwordHasher.hash(password);

      await User.updateOne({ _id: userId }, { password: hashedPassword });

      res.status(responseCodesEnum.UPDATE).json(constants.UPDATE_ANSWER);
    } catch (err) {
      next(err);
    }
  },

  mailVerification: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const { name, email } = await User.findOne({ _id: userId });
      const { accessToken } = await Oauth.findOne({ user: userId });

      const link = `${constants.HOST_NAME}/users/${userId}/password/${accessToken}`;

      await mailService.sendEmail(email, emailActionEnums.RESET_PASSWORD, { name, link });

      res.status(responseCodesEnum.OK);
    } catch (err) {
      next(err);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find({}).lean();

      res.status(responseCodesEnum.OK).json(users);
    } catch (err) {
      next(err);
    }
  },

  getUser: (req, res, next) => {
    try {
      const { user } = req;

      res.status(responseCodesEnum.OK).json(user);
    } catch (err) {
      next(err);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const { body: { password, email, name }, avatar } = req;

      const hashedPassword = await passwordHasher.hash(password);

      const createdUser = await User.create({ ...req.body, password: hashedPassword });

      const { _id } = createdUser;
      const { accessToken, refreshToken } = authService.getTokenPair();

      await Oauth.create({ accessToken, refreshToken, user: _id });

      const link = `${constants.HOST_NAME}/users/${_id}/confirm/${accessToken}`;

      await mailService.sendEmail(email, emailActionEnums.CONFIRM, { name, link });

      if (avatar) {
        const { pathForDb, finalPath, uploadPath } = await photoHelper.photoDirBuilder(avatar.name, _id, 'users');

        await mkDirPromise(uploadPath, { recursive: true });

        await avatar.mv(finalPath, (err) => {
          if (err) {
            throw new ErrorHandler(responseCodesEnum.SERVER_ERROR, CANT_UPLOAD_FILE.message, CANT_UPLOAD_FILE.code);
          }
        });

        const newAvatar = await Avatar.create({ url: path.normalize(pathForDb), isActive: true, user: _id });

        await User.updateOne({ _id }, { avatar: [newAvatar._id] });
      }

      const normalizedUser = userHelper.userNormalizator(createdUser.toObject());

      res.status(responseCodesEnum.CREATED).json(normalizedUser);
    } catch (err) {
      next(err);
    }
  },

  confirmAccount: async (req, res, next) => {
    try {
      const { token, userId } = req.params;

      const { user: { _id: id } } = await Oauth.findOne({ accessToken: token });

      if (id.toString() !== userId.toString()) {
        throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, UN_AUTHORIZED.message, UN_AUTHORIZED.code);
      }

      await User.updateOne({ _id: id }, { isVerified: true });

      res.status(responseCodesEnum.OK).json(constants.CONFIRM_ACCOUNT_ANSWER);
    } catch (err) {
      next(err);
    }
  },

  addAvatar: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { avatar } = req;

      if (avatar) {
        const { pathForDb, finalPath, uploadPath } = await photoHelper.photoDirBuilder(avatar.name, userId, 'users');

        await mkDirPromise(uploadPath, { recursive: true });

        await avatar.mv(finalPath, (err) => {
          if (err) {
            throw new ErrorHandler(responseCodesEnum.SERVER_ERROR, CANT_UPLOAD_FILE.message, CANT_UPLOAD_FILE.code);
          }
        });

        const newAvatar = await Avatar.create({ url: path.normalize(pathForDb), isActive: true, user: userId });

        const { avatar: userAvatar } = await User.findOne({ _id: userId });

        userAvatar.push(newAvatar._id);

        await User.updateOne({ _id: userId }, { avatar: userAvatar });
      }

      res.json(constants.UPDATE_ANSWER);
    } catch (err) {
      next(err);
    }
  },

  removeUserById: async (req, res, next) => {
    try {
      const { userId } = req.params;

      await User.updateOne({ _id: userId }, { deleted: true });

      res.status(responseCodesEnum.DELETE).json(constants.DELETE_ANSWER);
    } catch (err) {
      next(err);
    }
  },

  updateUserById: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { email } = req.user;

      await User.findByIdAndUpdate(userId, req.body);

      const user = await User.findOne({ _id: userId });

      await mailService.sendEmail(email, emailActionEnums.USER_UPDATE, { name: user.name, email: user.email, age: user.age });

      res.json(constants.UPDATE_ANSWER);
    } catch (err) {
      next(err);
    }
  }
};
