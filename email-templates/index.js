const { emailActionEnums } = require('../constants');

module.exports = {
  [emailActionEnums.WELCOME]: {
    templateName: 'welcome',
    subject: 'Welcome on board'
  },

  [emailActionEnums.USER_UPDATE]: {
    templateName: 'userUpdate',
    subject: 'User was updated'
  },

  [emailActionEnums.USER_DELETE]: {
    templateName: 'userDelete',
    subject: 'User was deleted'
  },

  [emailActionEnums.RESET_PASSWORD]: {
    templateName: 'resetPassword',
    subject: 'Confirm your password changing'
  }
};
