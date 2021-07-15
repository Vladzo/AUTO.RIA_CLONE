const { Schema, model } = require('mongoose');

const { dataBaseTablesEnum } = require('../constants');

const AvatarSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: dataBaseTablesEnum.USER
  }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = model(dataBaseTablesEnum.AVATAR, AvatarSchema);
