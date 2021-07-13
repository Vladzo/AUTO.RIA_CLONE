const { Schema, model } = require('mongoose');

const { userRolesEnum, dataBaseTablesEnum } = require('../constants');

const userSchema = new Schema({
  avatar: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  age: {
    type: Number,
    default: 18
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: Object.values(userRolesEnum),
    default: userRolesEnum.USER
  }
}, { timestamps: true });

module.exports = model(dataBaseTablesEnum.USER, userSchema);
