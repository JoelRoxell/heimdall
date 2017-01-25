'use strict';

const expect = require('chai').expect;

const validateFields = require('./validate-fields');

describe('validate fields util', () => {
  it('should require fields: email, password', async () => {
    const validator = validateFields({
      email: {
        type: String,
        message: 'required'
      },
      password: {
        type: String
      }
    });

    const ctx = {
      request: {
        body: {
          email: '1324',
          password: 123456
        }
      }
    };

    try {
      await validator(ctx, () => {});
    } catch (e) {
      expect(e.errors[0]).to.deep.equal({
        field: 'password',
        input: 123456,
        message: 'Wrong type was passed for parameter password',
        type: String
      });
    }
  });

  it('should miss email parameter', async () => {
    const validator = validateFields({
      email: {
        type: String,
        message: 'required'
      }
    });

    const ctx = {
      request: {
        body: {
          password: 123456
        }
      }
    };

    try {
      await validator(ctx, () => {});
    } catch (e) {
      expect(e.errors[0]).to.deep.equal({
        field: 'email',
        input: undefined,
        message: 'required',
        type: String
      });
    }
  });
});
