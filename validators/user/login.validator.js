const Joi = require('joi');

const { regex } = require('../../constants');

module.exports = {
  createUser: Joi.object().keys({
    email: Joi.string().required().regex(regex.EMAIL_REGEX),
    password: Joi.string().required().min(8).max(256)
      .regex(regex.PASSWORD_REGEX),
  })
};
