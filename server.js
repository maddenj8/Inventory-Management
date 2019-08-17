var express = require('express')
var multer = require('multer')
var fs = require('fs')
var app = express();
var credentials = require('./credentials.json')
var sql = require('mysql')
app.use(express.static(__dirname))
app.use(express.json())
var barcode

var connection = sql.createConnection(credentials)

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var dir = './uploads/' + req.body.box_id
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir)
        dir += '/' + barcode
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir)
        
        cb(null, dir); // when making new box, create directory for images
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

app.get('/latest_barcode', function(req, res) {
    console.log('endpoint barcode: ' + barcode)
    res.send(barcode) // endpoint for front-end to get latest barcode
})

app.get('/items', (req, res)=> {
    console.log(req.query.user)
    // var query = 
    res.send('done')
})

app.post('/newitem/upload', upload.array('images'), function(req, res) {
    var query = 'INSERT INTO `inventory-items`(user_id, title, box_id, description, sale_type, make, current_state, est_price, barcode) ' +
                'VALUES ("' + req.body.user_name + '","' +
                req.body.title + '","' + 
                req.body.box_id + '","' +
                req.body.description + '","' + req.body.sale_type + '","' + 
                req.body.make + '","' + 
                req.body.current_state + '","' +
                req.body.est_price + '","' +
                barcode +'")'
    do_query(query)
    barcode = parseInt(barcode)
    barcode++
    barcode = barcode.toString()

    try {
        res.redirect('/?success=true')
    } catch(err) {res.send(400)}
})

app.listen(8080, function(a) {
    console.log('Listening on localhost:8080 or 127.0.0.1:8080')
})

function do_query(query, callback) {
    connection.query(query, function (err, results) {
        if (err) {
            console.log('>>>> ' + err)
        }
        if (callback) callback(results)
    })
}

function get_latest_barcode() {
    var query = "SELECT MAX(barcode) as mbc from `inventory-items`"
    do_query(query, function(results) {
        var latest_barcode = results[0].mbc
        console.log('latest barcode: ' + latest_barcode)
        if (latest_barcode) barcode = (parseInt(latest_barcode) + 1).toString()
        else barcode = '12400000001' // base barcode
    })
}

function handle_disconnect() {
    connection = sql.createConnection(credentials)
    connection.connect(function(err) {
        if (err) {
            console.log('Waiting to reconnect')
            setTimeout(handle_disconnect, 2000) // delay before trying to reconnect
        }
    })

    connection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Trying to reconnect again')
            handle_disconnect()
        }
        else {throw err}
    })
}

handle_disconnect()
get_latest_barcode()