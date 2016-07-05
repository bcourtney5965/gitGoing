const authKeys = require('../../../apiKeys.js');
const GithubStrategy = require('passport-github').Strategy;
// callbackURL: 'http://localhost:3000/api/auth/github/callback'
module.exports = function(passport) {
  passport.use(new GithubStrategy({
    clientID: authKeys.gitHubAuth.clientID,
    clientSecret: authKeys.gitHubAuth.clientSecret,
    callbackURL: '45.55.146.9:3000/api/auth/github/callback'
  }, function(accessToken, refreshToken, profile, done){
    done(null, {
      accessToken: accessToken,
      profile: profile
    });
  }));

  passport.serializeUser(function(user, done) {
    const userObj = {
      accessToken: user.accessToken,
      id: user.profile.id,
      username: user.profile.username,
      profileUrl: user.profile.profileUrl,
      provider: user.profile.provider,
      photos: JSON.stringify(user.profile.photos)
    }
    done(null, userObj);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
}
