'use strict';

const bcrypt = require('bcrypt');

module.exports = function encryptPassword(done) {
  if (!this.isModified('password')) {
    return reject();
  }

  bcrypt.genSalt(Number.parseInt(process.env.SALT_ROUNDS, 10) || 10, (err, salt) => {
    if (err) throw err;

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) throw err;

      this.password = hash;

      done();
    });
  });
};
