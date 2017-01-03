const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const {SECRET_KEY} = require('../config/config');


router.post('/preggie/bind', function(req, res, next) {
    let payload = Object.keys(req.body).sort().map((key) => {
        return `${key}=${req.body[key]}`;
    });

    payload.push(SECRET_KEY);

    let token = jwt.sign(payload.join("&"), SECRET_KEY);

    res.json({
        "status": 200,
        "result": true,
        "auth-token": "JWT " + token
    });
});

module.exports = router;
