var router = require('express').Router();
const isAuthenticated = require('../util/authentication.js');

module.exports = function(app, redisClient) {
  router.route('/signin')
    .get(function(req,res) {
      res.render('./signin.html');
    });

  router.route('/testapi')
    .get(function(req,res) {
      res.json({hey: 'hey'});
    });

  router.route('/logout')
    .get(function(req, res) {
      req.session.destroy(function(err) {
        if (err) {
          console.log(err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/signin');
      });
    });

  router.route('/*')
    .get(function (req, res) {
      res.render('index.html');
    });

  router.route('/')
    .get(isAuthenticated, function(req, res) {
      res.render('/signin');
    });

  // router.route('')
  //   .get(isAuthenticated, function(req, res) {
  //     res.render('index.html');
  //   });

  app.use('', router);
};
