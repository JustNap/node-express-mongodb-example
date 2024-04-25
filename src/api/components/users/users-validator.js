const joi = require('joi');
const { changePassword } = require('./users-controller');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      password_confirm: joi.string().valid(joi.ref('password')).required().label('password confirm')
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword:{
    body:{
      password_lama: joi.string().min(6).max(32).required().label('Password lama'),
      password_baru: joi.string().min(6).max(32).required().label('Password baru'),
      password_baru_confirm: joi.string().valid(joi.ref('password_baru')).required().label('password confirm'),
    },
  },
};

