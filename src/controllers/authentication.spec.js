// 'use strict';
//
// const sinon = require('sinon');
//
// const factory = require('../utils/factory');
// const UserModel = require('../models/user-model');
// const expect = require('../utils/test-helper').expect;
//
// xdescribe('authenticateCtrl', () => {
//   it('should authentcate a user', async () => {
//     const user = factory.create('User', {
//       email: 'test@test.com',
//       password: '12345'
//     });
//
//     const save = sinon.stub(UserModel.prototype, 'save');
//
//     save.returns(Promise.resolve(true));
//
//     console.log(user);
//
//     await user.save();
//
//     console.log(user);
//
//     const result = await user.authenticate('12345');
//
//     save.restore();
//
//     expect(result).to.equal(true);
//   });
// });
