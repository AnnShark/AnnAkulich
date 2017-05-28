let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
{ passReqToCallback: true },

(req, username, password, done) => {
  let user = users.find(user => username === user.username);

  if (!user) return done(null, false);

  if (user.password !== password) return done(null, user);

  return done(null, user);
},

));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
