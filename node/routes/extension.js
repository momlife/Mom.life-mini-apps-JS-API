const express = require('express');
const router = express.Router();
const request = require('request');

const {MOMLIFE_API_HOST, APP_ID} = require('../config/config');


router.get('/getUser', function(req, res, next) {
    request(`${MOMLIFE_API_HOST}/extension/internal/${APP_ID}/user?user_id=${req.query['user_id']}`, function (error, response, body) {
        res.json(JSON.parse(body));
    });
});

module.exports = router;
