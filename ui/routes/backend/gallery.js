var fs = require('fs-extra');
var express = require('express');
var router = express.Router();
module.exports = router;

//////////////////////////////////////////////
//////////////////////////////////////////////
// GET

router.get('/store', function(req, res) {
    res.render('./backend/gallery/store');
});

//////////////////////////////////////////////
//////////////////////////////////////////////
// POST

multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty(),

router.post('/upload', multipartyMiddleware, function(req, res) {
    var fsold = require('fs');
    fsold.readFile(req.files.file.path, function (err, data) {
        var newPath = GLOBAL.OPTION_UPLOAD.UPLOAD_DIR + "/" + req.files.file.name;
        fsold.writeFile(newPath, data, function (err) {
            res.json(true);
        });
    });
});

router.post('/create-folder', function(req, res) {
    body = req.body.folder;
    body = GLOBAL.OPTION_UPLOAD.UPLOAD_DIR + '/' + body;
    fs.mkdirs(body, function (err) {
        if (err) {
            res.json(false);
            return
        };            
        res.json(true);
    });        
});

router.post('/remove', function(req, res) {
    var body = req.body.name;
    body = GLOBAL.OPTION_UPLOAD.UPLOAD_DIR + '/' + body;
    fs.remove(body, function (err) {
        if (err) {
            res.json(false);
            return;
        }
        res.json(true);
    });    
});