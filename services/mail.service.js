const nodemailer = require('nodemailer');
const EmailTemplates = require('email-templates');
const path = require('path');

const { EMAIL, EMAIL_PASSWORD } = require('../constants/constants');
const { responseCodesEnum } = require('../constants');
const templateInfo = require('../email-templates');
const { ErrorHandler, errorMessages } = require('../errors');

const templateParser = new EmailTemplates({
  views: {
    root: path.join(process.cwd(), 'email-templates')
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD
  }
});

const sendEmail = async (email, action, context = {}) => {
  const templateToSend = templateInfo[action];

  if (!templateToSend) {
    throw new ErrorHandler(responseCodesEnum.NOT_FOUND, errorMessages.WRONG_TEMPLATE.message,
      errorMessages.WRONG_TEMPLATE.code);
  }

  const html = await templateParser.render(templateToSend.templateName, context);

  await transporter.sendMail({
    from: 'Title',
    to: email,
    subject: templateToSend.subject,
    html
  });
};

module.exports = {
  sendEmail
};
