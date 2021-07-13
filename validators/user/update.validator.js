const Joi = require('joi');

const { regex, userRolesEnum } = require('../../constants');

module.exports = {
  createUser: Joi.object().keys({
    name: Joi.string().min(1).max(70),
    email: Joi.string().regex(regex.EMAIL_REGEX),
    password: Joi.string().min(8).max(256).regex(regex.PASSWORD_REGEX),
    age: Joi.number().min(1).max(120),
    role: Joi.string().allow(...Object.values(userRolesEnum)),
  })
};
