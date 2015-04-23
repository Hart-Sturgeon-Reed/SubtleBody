angular.module('ControlApp', [])
.controller('Controller', ['$scope', function($scope) {
    $scope.midControls = [
        {text:'Reset World', down:false, label:'R'},
        {text:'Switch Mode', down:false, label:'M'},
        {text:'Disable Effect', down:false, label:'D'},
        {text:'Pause', down:false, label:'P'}
    ];
    $scope.leftControls = [
        {text:'Set Secondary', down:true, label:'SS'},
    ];
    $scope.rightControls = [
        {text:'Set Primary', down:true, label:'SP'},
    ];
}]);

function init(){
    socket = io();
    socket.on('start up',function(id) {
        console.log('We are Control Panel #'+id);
        socket.emit('init controller');
    });
    
    $('.rightButton').click(function(e){
        socket.emit('primary click');
    });
    
    $('.leftButton').click(function(e){
        socket.emit('secondary click');
    });
    $('#M').click(function(e){
        socket.emit('switch mode');
    });
    $('#D').click(function(e){
        socket.emit('disable effect');
    });
    $('#P').click(function(e){
        socket.emit('pause');
    });
    
    lockedAllowed = window.screen.orientation.lock('landscape-primary');
    if (window.DeviceMotionEvent == undefined) {
        //No accelerometer is present. Use buttons. 
        console.log("no accelerometer");
    } else {
        console.log("accelerometer found");
        window.addEventListener("devicemotion", accelerometerUpdate, true);
        
        window.ondevicemotion = function(event) {  
            accelerometerUpdate(event);
        } 
    }
}

function accelerometerUpdate(event) {
    var aX = event.accelerationIncludingGravity.x*1;
    var aY = event.accelerationIncludingGravity.y*1;
    var aZ = event.accelerationIncludingGravity.z*1;
    //The following two lines are just to calculate a
    // tilt. Not really needed. 
    var xPosition = Math.atan2(aY, aZ);
    var yPosition = Math.atan2(aX, aZ);
    
    var accel = {
        x: aX,
        y: aY,
        z: aZ,
        xTilt: xPosition,
        yTilt: yPosition
    }
    console.log(aX+', '+aY+', '+aZ);
    console.log(xPosition+', '+yPosition);
    socket.emit('accel', accel);
}