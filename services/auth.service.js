const jwt = require('jsonwebtoken');
const util = require('util');

const { constants } = require('../constants');

const verifyPromise = util.promisify(jwt.verify);

module.exports = {
  getTokenPair: () => {
    const accessToken = jwt.sign({}, constants.ACCESS_SECRET_KEY, { expiresIn: constants.ACCESS_TOKEN_TIME });
    const refreshToken = jwt.sign({}, constants.REFRESH_SECRET_KEY, { expiresIn: constants.REFRESH_TOKEN_TIME });

    return {
      accessToken,
      refreshToken
    };
  },

  verifyToken: async (token, tokenType = constants.ACCESS) => {
    const secretKey = tokenType === constants.ACCESS ? constants.ACCESS_SECRET_KEY : constants.REFRESH_SECRET_KEY;

    await verifyPromise(token, secretKey);
  }
};
