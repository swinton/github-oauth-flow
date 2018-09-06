require('dotenv').config();

const request = require('request-promise');

const express = require('express');

const router = express.Router({
  mergeParams: true
});

router.all((req, res, next) => {
  next();
});

// https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-users-are-redirected-to-request-their-github-identity
router.get('/login', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?` +
      `client_id=${process.env.CLIENT_ID}&` +
      `redirect_uri=${process.env.REDIRECT_URI}&` +
      `state=abc123`
  );
});

// https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
router.get('/oauth/token', async (req, res) => {
  // TODO: Verify state

  // POST https://github.com/login/oauth/access_token
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GitHub/@swinton'
      },
      json: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code,
        state: req.query.state,
        redirect_uri: process.env.REDIRECT_URI
      },
      url: 'https://github.com/login/oauth/access_token'
    };
    const body = await request.post(options);
    res.cookie('access_token', body.access_token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
