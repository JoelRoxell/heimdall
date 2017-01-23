
'use strict';

const mongoose = require('mongoose');
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

mongoose.Promise = global.Promise;

before(done => {
  mongoose.connect('mongodb://mongo/authentication_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', error => console.log('error', error)
  );
});

// beforeEach(done => {
//   mongoose.connection.collections.users.drop(() => done());
// });

after(() => {
  mongoose.connection.close();
});

module.exports = {
  expect: chai.expect,
  mongoose
};
