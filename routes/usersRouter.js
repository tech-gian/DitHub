const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const authenticate = require('../authenticate');

const lib = require("./lib");

const User = require("../models/users");
const router = express.Router();

router.use(bodyParser.json());

// Sign up
router.post('/signup', (req, res, next) => {
    User.findOne({ email: lib.escapeHtml(req.body.email) })
        .then((user) => {
            if (user) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: "Email exists" });
            } else {
                User.register(new User({ username: lib.escapeHtml(req.body.username) }),
                    req.body.password, (err, user) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ err: "Internal Server Error" });
                        } else {
                            user.username = lib.escapeHtml(req.body.username);
                            user.email = lib.escapeHtml(req.body.email);
                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode = 500;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ err: "Internal Server Error" });
                                }
                                passport.authenticate('local')(req, res, () => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    var token = authenticate.getToken({ _id: req.user._id });
                                    res.json({ token: token, u_id: req.user.username });
                                });
                            });
                        }
                    });
            }
        });
});

// Log in using local passport authentication
router.post('/login', passport.authenticate('local'), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ token, u_id: req.user.username });
});

// Log in using facebook passport authentication
router.post('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ token, u_id: req.user.username });
    }
});

module.exports = router;
