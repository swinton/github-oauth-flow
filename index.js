require('dotenv').config();

const express = require('express');
const nunjucks = require('nunjucks');
const authRouter = require('./lib/auth');

const app = express();
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', (req, res) => {
  res.render('index.html', { foo: 'bar' });
});

app.use('/auth', authRouter);

const server = app.listen(5000, () => {
  console.log(`server running at: ${server.address().port}`);
});
