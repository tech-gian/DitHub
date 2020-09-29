const express = require("express");
const bodyParser = require("body-parser");

const authenticate = require('../authenticate');

const lib = require("./lib");

const Teams = require("../models/teams");
const teamsRouter = express.Router();

teamsRouter.use(bodyParser.json());

teamsRouter.route("/")
    // Get all teams titles
    .get((req, res, next) => {
        Teams.find({}).select("title")
            .then((teams) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(teams);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // Create a new team
    .post(authenticate.verifyUser, (req, res, next) => {
        Teams.create({
            "creator": req.user._id,
            "title": lib.escapeHtml(req.body.title),
        }).then((team) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(team);
        }, (err) => next(err))
            .catch((err) => next(err));
    });

teamsRouter.route("/:teamId/messages")
    // Get all messages of a specific team
    .get((req, res, next) => {
        Teams.findById(req.params.teamId)
            .populate('messages.author')
            .then((team) => {
                if (team) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(team.messages);
                } else {
                    err = new Error('Team ' + req.params.teamId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // Handle new message sending
    .post(authenticate.verifyUser, (req, res, next) => {
        Teams.findById(req.params.teamId)
            .then((team) => {
                if (team != null) {
                    let message = {
                        "author": req.user._id,
                        "text": lib.escapeHtml(req.body.text)
                    };
                    team.messages.push(message);
                    team.save()
                        .then((team) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            message._id = team.messages[team.messages.length - 1]._id;
                            res.json(message);
                        }, (err) => next(err));
                } else {
                    err = new Error('Team ' + req.params.teamId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

teamsRouter.route('/:teamId/messages/:messageId')
    .delete(authenticate.verifyUser, (req, res, next) => {
        // Delete message with certain id, if the author id equals user's id
        Teams.findById(req.params.teamId)
            .then((team) => {
                if (team && team.messages.id(req.params.messageId) && team.messages.id(req.params.messageId).author.equals(req.user._id)) {
                    team.messages.id(req.params.messageId).remove();
                    team.save()
                        .then((team) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(team);
                        }, (err) => next(err));
                } else {
                    err = new Error('An error occured.');
                    err.status = 500;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

teamsRouter.route('/:teamId/messages/:messageId/comments')
    .get((req, res, next) => {
        // Get comments of a certain message
        Teams.findById(req.params.teamId)
            .populate('messages.comments.author')
            .then(team => {
                if (team && team.messages.id(req.params.messageId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(team.messages.id(req.params.messageId).comments);
                }
            });
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        // Allow a signed in user to post a comment
        Teams.findById(req.params.teamId)
            .then(team => {
                if (team && team.messages.id(req.params.messageId)) {
                    let comment = {
                        "author": req.user._id,
                        "text": lib.escapeHtml(req.body.text)
                    };
                    team.messages.id(req.params.messageId).comments.push(comment);
                    team.save()
                        .then(team => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(lib.escapeHtml(req.body.text));
                        });
                } else {
                    res.sendStatus(404);
                }
            });
    });

module.exports = teamsRouter;
