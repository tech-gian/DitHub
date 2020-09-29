const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');            // File responsible for authentication

const lib = require("./lib");                               // Useful custom library

const Announcements = require('../models/announcements');   // Announcements mongoose model
const announcementsRouter = express.Router();               // Declare announcements router

announcementsRouter.use(bodyParser.json());

announcementsRouter.route('/')
    // Count announcements
    .get((req, res, next) => {
        Announcements.countDocuments({})
            .then((count) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(count);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyAdmin, (req, res, next) => {
        // Allow admins to create a new announcements through POST requests
        Announcements.create({
            title: lib.escapeHtml(req.body.title),
            source: lib.escapeHtml(req.body.source)
        })
            .then((announcement) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(announcement);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

announcementsRouter.route('/:announcementId')
    .get((req, res, next) => {
        // Get a specific announcement by it's id
        Announcements.findById(req.params.announcementId)
            .then((announcement) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(announcement);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authenticate.verifyAdmin, (req, res, next) => {
        // Allow admins to update a specific announcement
        Announcements.findByIdAndUpdate(req.params.announcementId, {
            $set: req.body
        }, { new: true })
            .then((announcement) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(announcement);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyAdmin, (req, res, next) => {
        // Allow admins to delete a specific announcement
        Announcements.findByIdAndRemove(req.params.announcementId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

announcementsRouter.route('/pages/:page')
    .get((req, res, next) => {
        // Get 5 announcements at a time, sorted by `updatedAt` (pagination)
        let page = parseInt(req.params.page) || 0;
        Announcements.find({}, {}, { skip: page * 5, limit: 5 }).sort({ "updatedAt": 'descending' })
            .then((announcements) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(announcements);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = announcementsRouter;
