'use strict';

const bcrypt = require('bcrypt');

module.exports = function encryptPassword(done) {
  bcrypt.genSalt(Number.parseInt(
    process.env.SALT_ROUNDS, 10) || 10,
    (err, salt) => {
      if (err) {
        return done(err);
      }

      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          return done(err);
        }

        this.password = hash;

        return done();
      });
    });
};
