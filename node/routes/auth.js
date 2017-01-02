const express = require('express');
const router = express.Router();


router.post('/preggie/bind', function(req, res, next) {
    res.json({
        "status": 200,
        "result": true,
        "auth-token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
    });
});

module.exports = router;
