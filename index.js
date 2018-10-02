

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs') ; 



app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send("Hello World"); 
    next()
  });
io.on('connection', function(socket){
    console.log('a user connected');    
    var prayerStartTime = getTimeFromFile() ;     
    socket.emit('iqamaTime', prayerStartTime) ;       
    socket.on('disconnect', function(){
        console.log("user disconnected");
    });

    socket.on('iqamaTime', function(data){              
        setTime(data)
        io.emit('iqamaTime', data);
    })
});

var getTimeFromFile = function(){
    let data = fs.readFileSync('prayerStartTime.json');     
    return JSON.parse(data) ; 
}

var setTime = function(prayerStartTime){
    var data = JSON.stringify(prayerStartTime); 
    fs.writeFileSync('prayerStartTime.json', data);     
}

http.listen(3000, function(){
    console.log('listening on *:3000')
})