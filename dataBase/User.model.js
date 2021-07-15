const { Schema, model } = require('mongoose');

const { userRolesEnum, dataBaseTablesEnum } = require('../constants');

const userSchema = new Schema({
  deleted: {
    type: Schema.Types.Boolean,
    index: true,
    default: false
  },
  avatar: [{
    type: Schema.Types.ObjectId,
    ref: dataBaseTablesEnum.AVATAR
  }],
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
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

userSchema.pre('find', function() {
  this.where({ deleted: false });
  this.populate('avatar');
});

userSchema.pre('findOne', function() {
  this.where({ deleted: false });
  this.populate('avatar');
});

module.exports = model(dataBaseTablesEnum.USER, userSchema);
