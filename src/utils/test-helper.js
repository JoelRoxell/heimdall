
'use strict';

const mongoose = require('mongoose');
const chai = require('chai');

chai.should();
chai.use(require('chai-things'));

mongoose.Promise = global.Promise;

before(done => {
  mongoose.connect(`mongodb://mongo/authentication_${process.env.NODE_ENV}`);
  mongoose.connection
    .once('open', () => done())
    .on('error', error => console.log('error', error)
  );
});

after(() => {
  mongoose.connection.close();
});

function tareDownCollection(collection) {
  return new Promise(function(resolve, reject) {
    if (!mongoose.connection.collections.hasOwnProperty(collection)) {
      reject('collection does not exist');
    }

    mongoose.connection.collections[collection]
      .drop()
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

module.exports = {
  expect: chai.expect,
  mongoose,
  tareDownCollection
};
