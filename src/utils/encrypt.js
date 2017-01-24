'use strict';

const bcrypt = require('bcrypt');

exports.encrypt = function encryptPassword() {
  return new Promise((resolve, reject) => {
    if (!this.isModified('password')) {
      return reject();
    }

    bcrypt.genSalt(Number.parseInt(process.env.SALT_ROUNDS, 10) || 10, (err, salt) => {
      if (err) throw err;

      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) throw err;

        this.password = hash;

        resolve();
      });
    });
  });
};
