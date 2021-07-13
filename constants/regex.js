module.exports = {
  EMAIL_REGEX: new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'),
  PASSWORD_REGEX: new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'),
  ID_REGEX: new RegExp('^[a-f\\d]{24}$')
};
