var express = require('express');
var router = express.Router();
module.exports = router;

//////////////////////////////////////////////
//////////////////////////////////////////////
// GET

router.get('/', function (req, res) {
    res.render('./backend/template/index');
});

//////////////////////////////////////////////
//////////////////////////////////////////////
// POST
