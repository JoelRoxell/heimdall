'use strict';

const bcrypt = require('bcrypt');

module.exports = function encryptPassword(done) {
  bcrypt.genSalt(Number.parseInt(process.env.SALT_ROUNDS, 10) || 10, (err, salt) => {
    if (err) done(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) done(err);

      this.password = hash;

      done();
    });
  });
};
