const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');           // File responsible for authentication

const lib = require("./lib");                              // Useful custom library

const Instructions = require('../models/instructions');    // Instructions mongoose model
const instructionsRouter = express.Router();               // Declare instructions router

instructionsRouter.use(bodyParser.json());

instructionsRouter.route('/')
    // Count instructions
    .get((req, res, next) => {
        Instructions.countDocuments({})
            .then((count) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(count);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyAdmin, (req, res, next) => {
        // Allow admins to create a new instructions through POST requests
        Instructions.create({
            title: lib.escapeHtml(req.body.title),
            description: lib.escapeHtml(req.body.description),
            image: lib.escapeHtml(req.body.image),
            file: lib.escapeHtml(req.body.file),
            link: lib.escapeHtml(req.body.link)
        })
            .then((instruction) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(instruction);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

instructionsRouter.route('/:InstructionId')
    .get((req, res, next) => {
        // Get a specific instruction by it's id
        Instructions.findOne({ "link": req.params.InstructionId })
            .then((instruction) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(instruction);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authenticate.verifyAdmin, (req, res, next) => {
        // Allow admins to update a specific instruction
        Instructions.findByIdAndUpdate(req.params.InstructionId, {
            $set: req.body
        }, { new: true })
            .then((instruction) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(instruction);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyAdmin, (req, res, next) => {
        // Allow admins to delete a specific instruction
        Instructions.findByIdAndRemove(req.params.InstructionId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

instructionsRouter.route('/pages/:page')
    .get((req, res, next) => {
        // Get 5 instructions at a time (pagination)
        let page = parseInt(req.params.page) || 0;
        Instructions.find({}, {}, { skip: page * 5, limit: 5 })
            .then((instructions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(instructions);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = instructionsRouter;
