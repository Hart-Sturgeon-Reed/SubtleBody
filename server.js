var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var osc = require('osc-min');
var udp = require('dgram');

var clientNum = 1;
var controllerNum = 1;

var game = null;
var controllers = [];

app.use(express.static(__dirname));

app.get('/Control/', function(req, res){
    res.sendFile(__dirname+'/control.html');
});

app.get('/', function(req, res){
    res.sendFile(__dirname+'/client.html');
});

function setupOSC(){
    oscSocket = udp.createSocket("udp4", function(msg, rinfo) {
      var error;
      try {
          var data = osc.fromBuffer(msg);
          //console.log(data);
          if(game){
            game.emit('osc', data);
          }
      } catch (_error) {
        error = _error;
        return console.log("invalid OSC packet");
      }
    });

    oscSocket.bind(3000);
}

function sendOSC(label,data){
    try {
        var buf = osc.toBuffer({
            address: '/kinect',
            args: [data]
        });

        udp.send(buf,0,buf.length,3001,'192.168.0.101');
        
    } catch (error){
        console.log(error);
    }
}

setupOSC();

io.on('connection', function(socket){
    console.log('client '+clientNum+' connected');
    socket.sid = clientNum;
    socket.emit('start up', clientNum++);
    
    socket.on('init game',function(){
        game = socket;
        console.log('client '+socket.sid+' is the game client');
        socket.on('set color',function(num,color,style){
            var controller = getController(num);
            if(controller==null) {console.log('error: controller '+num+' not found'); return;}
            console.log('setting controller '+num+' to color '+color);
            controller.emit('set color',color,style);
        });
    });
    
    socket.on('init controller',function(){
        var controller = socket;
        console.log('client '+socket.sid+' is a controller');
        socket.num = controllerNum++;
        controllers.push(controller);
        socket.isController = true;
        game.emit('add controller', socket.num);
        // controller events
        socket.on('accel', function(accel){
            if(game){
                game.emit('accel', accel, socket.num);
            }
        });
        socket.on('primary click', function(accel){
            console.log('primary click');
            if(game){
                game.emit('primary click',socket.num,accel);
            }
        });
        socket.on('secondary click', function(accel){
            console.log('secondary click');
            if(game){
                game.emit('secondary click',socket.num, accel);
            }
        });
        socket.on('new cell', function(e){
            console.log('new cell driver');
            if(game){
                game.emit('new cell',controller.num);
            }
        });
        socket.on('reset cell', function(){
            console.log('disabling effect');
            if(game){
                game.emit('reset cell',controller.num);
            }
        });
        socket.on('recolor', function(){
            console.log('recoloring cell');
            if(game){
                game.emit('recolor',controller.num);
            }
        });
        socket.on('pause', function(){
            console.log('toggling pause');
            if(game){
                game.emit('pause');
            }
        });
        socket.on("disconnect", function(){
            if(game){
                game.emit('controller disconnected', socket.num);
            }
        });
    });
    
    socket.on("disconnect", function(){
        console.log('client '+socket.sid+' disconnected');
    });
    socket.on("send osc", function(data){
        console.log('sending message');
        sendOSC('/kinect',data);
    });
});

function getController(num){
    for(var c of controllers){
        if(c.num==num) return c;
    }
    return null;
}



http.listen(3000,function(){
    console.log('server started on 3000');
});