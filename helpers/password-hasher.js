const bcrypt = require('bcrypt');

const { ErrorHandler, errorMessages: { WRONG_PASSWORD_OR_EMAIL } } = require('../errors');
const { responseCodesEnum, constants: { SALT } } = require('../constants');

module.exports = {
  compare: async (hashedPassword, password) => {
    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatched) {
      throw new ErrorHandler(responseCodesEnum.UN_AUTHORIZED, WRONG_PASSWORD_OR_EMAIL.message,
        WRONG_PASSWORD_OR_EMAIL.code);
    }
  },

  hash: (password) => bcrypt.hash(password, SALT)
};
