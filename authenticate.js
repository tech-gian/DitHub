
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('./models/users');
const config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Get users' signed JWT
exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {});
};

// Set JWT options
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        } else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.username = profile.name.givenName + " " + profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));

// User verification middleware
exports.verifyUser = passport.authenticate('jwt', { session: false });

// Admin verification middleware
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
}
