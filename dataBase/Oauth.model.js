const { Schema, model } = require('mongoose');

const { dataBaseTablesEnum } = require('../constants');

const OauthSchema = new Schema({
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: dataBaseTablesEnum.USER
  }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

OauthSchema.pre('find', function() {
  this.populate('user');
});

OauthSchema.pre('findOne', function() {
  this.populate('user');
});

module.exports = model(dataBaseTablesEnum.O_AUTH, OauthSchema);
