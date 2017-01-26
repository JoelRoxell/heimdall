'use strict';


const ValidationError = function(opt) {
  this.field = opt.field;
  this.type = opt.type;
  this.message = opt.message;
  this.input = opt.input;
};

module.exports = function validateFields(requiredFields) {
  return async function validator(ctx, next) {
    try {
      const fields = ctx.request.body;

      const validationRes = Object.keys(requiredFields).map(field => {
        if (!fields.hasOwnProperty(field)) {
          // FIXME: refactor error instantiations.
          return new ValidationError({
            field: field,
            type: requiredFields[field].type,
            message: requiredFields[field].message || 'missing parameter'
          });
        }

        const Type = requiredFields[field].type;
        const getType = Object.prototype.toString;
        const isCorrectType =
          getType.call(fields[field]) === getType.call(new Type());

        if (!isCorrectType) {
          return new ValidationError({
            field,
            type: requiredFields[field].type,
            message: requiredFields[field].message ||
              `Wrong type was passed for parameter ${field}`,
            input: fields[field]
          });
        }
        return;
      }).filter(r => r !== undefined);

      if (validationRes.length) {
        const error = new Error('Request body did not pass validation');

        ctx.status = 400;
        error.errors = validationRes;

        throw error;
      }

      await next();
    } catch (e) {
      throw e;
    }
  };
};
