const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { userRouter, authRouter } = require('./routes');
const { constants, responseCodesEnum } = require('./constants');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();

_mongooseConnector();

app.use(fileUpload({}));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use('*', _notFoundHandler);
app.use(_handleErrors);

app.listen(constants.PORT, () => {
  console.log(`App listen ${constants.PORT}`);
});

// eslint-disable-next-line no-unused-vars
function _handleErrors(err, req, res, next) {
  res
    .status(err.status)
    .json({
      message: err.message || constants.UNKNOWN_ERROR,
      customCode: err.customCode || 0
    });
}

function _notFoundHandler(err, req, res, next) {
  next({
    status: err.status || responseCodesEnum.NOT_FOUND,
    message: err.message || constants.ROUTE_NOT_FOUND
  });
}

function _mongooseConnector() {
  mongoose.connect(constants.DB, { useNewUrlParser: true, useUnifiedTopology: true });
}
