var express = require('express');
const { render } = require('../app');
var router = express.Router();
var exec = require('child_process').exec;

var passport = require('passport');

router.get('/', function(req, res, next) {
    var data = {
        stdout: null
    }
    res.render('vdl', data);
});


router.post('/download', function(req, res, next) {
    const url = req.body.url;
    const vid = req.body.video_format;
    const aud = req.body.audio_format; 
    var download = 'youtube-dl -f ' + vid + '+' + aud + ' --merge-output-format mp4 ' + url;
    exec(download, function(err, stdout, stderr){
        if(err){
            var data = {
                errmsg: "ダウンロードできなかったゆん",
                output: null
            } 
            console.log('error downloading.');
            res.render('vdl', data);
            return
        }
    })
    .then(vd => {
        res.redirect('/vdl');
    })
});


router.post('/list', function(req, res, next) {
    const url = req.body.url;
    var download = 'youtube-dl --list-format ' + url;
    exec(download, {maxBuffer: 1024*1024 }, function(err, stdout, stderr){
        var data = {
            errmsg: null
        } 
        if(err){
            errmsg = "ダウンロードできなかったよん"
            console.log('error downloading.');
            res.render('vdl', data);
            return
        }
        res.render('vdl', data);
    });
});

module.exports = router;
