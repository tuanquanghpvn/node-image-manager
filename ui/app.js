var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression'); // Init Gzip
var ECT = require('ect');

// Backend
var home = require('./routes/backend/home');
var gallery = require('./routes/backend/gallery');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// view engine setup
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Init gallery for website
app.use('/gallery', require('node-gallery')({
    staticFiles : 'ui/public/upload',
    urlRoot : '/gallery', 
    title : '',
    render : false
}), function(req, res, next){ 
    var data = req.data;
    if(data.breadcrumb.length > 0){
        item = data.breadcrumb[data.breadcrumb.length-1]
        GLOBAL.OPTION_UPLOAD.UPLOAD_DIR = GLOBAL.DIRNAME + '/ui/public/upload/' + item.name.replace('gallery','').replace('\\', '/')
        GLOBAL.OPTION_UPLOAD.UPLOAD_URL = '/upload/' + item.name.replace('gallery','').replace('\\', '/')
    }
    else{
        GLOBAL.OPTION_UPLOAD.UPLOAD_DIR = GLOBAL.DIRNAME + '/public/upload/';
        GLOBAL.OPTION_UPLOAD.UPLOAD_URL = '/upload/';
    }   
    return res.json(data);
});

// Backend
app.use('/admin', home);
app.use('/admin/gallery', gallery);

// Init require authencation when redirect to admin url
app.all('*', function(req, res, next) {
    var patt = /\/admin/;    
    if (!patt.test(req.url)) {
        res.redirect('/admin');    
        return;
    };
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('./shared/error', {
            message: err.message,
            error: err
        });
    next();
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);  
    console.log(err);  
    res.render('./shared/error', {
        message: err.message,
        error: {}
    });
});

var port = process.env.PORT || 8686;
app.set('port', port);

app.listen(app.get('port'), function() {
    console.log('Website listen port ' + port);
});

module.exports = app;
