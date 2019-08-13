var express = require('express')
var multer = require('multer')
var app = express();
app.use(express.static(__dirname))
app.use(express.json())

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/' + req.body.box_id); // when making new box, create directory for images
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});


var upload = multer({storage:storage})
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/mainpage', function(req, res) {
    res.sendFile(__dirname + 'templates/mainpage.html')
})

app.post('/newitem/upload', upload.array('images'), function(req, res) {
    console.log(req.body)
    console.log(req.files)
    try {
        res.send(res.files)
    } catch(err) {res.send(400)}
})

app.post('/image/upload', function(req, res) {
    console.log('we reached here')
    upload(req, res, function(err) {
        if (err) return res.end('Something went wrong')
        return res.end('/')
    })
})

app.listen(8080, function(a) {
    console.log('Listening on localhost:8080 or 127.0.0.1:8080')
})