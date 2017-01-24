const Router = require('koa-router');

const authenticateCtrl = new Router();

function signIn(ctx, next) {
  ctx.body = 'Sign in';
}

function signOut(ctx) {
  ctx.body = 'terminated';
}

authenticateCtrl.post('/sign-out', signIn);
authenticateCtrl.post('/sign-out', signOut);

module.exports = {
  router: authenticateCtrl,
  signIn,
  signOut
};
