const Joi = require('joi');

const { regex } = require('../../constants');

module.exports = {
  createUser: Joi.object().keys({
    id: Joi.string().regex(regex.ID_REGEX).required()
  })
};
