const express = require('express');
const router = express.Router();


const {MOMLIFE_API_HOST, APP_ID} = require('../config/config');


router.get('/getUser', function(req, res, next) {

    // http://{{domain}}/extension/internal/{{extension_id}}/user?user_id={{user_id}}

    res.json({

    });
});

module.exports = router;
