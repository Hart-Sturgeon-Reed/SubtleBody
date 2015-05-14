angular.module('ControlApp', [])
.controller('Controller', ['$scope', function($scope) {
    $scope.midControls = [
        {text:'Reset Cell', down:false, label:'R'},
        {text:'Switch Color', down:false, label:'M'},
        {text:'New Cell', down:false, label:'D'},
        {text:'Pause', down:false, label:'P'}
    ];
    $scope.leftControls = [
        {text:'Reset Levels', down:false, label:'L'},
    ];
    $scope.rightControls = [
        {text:'Invert Controls', down:false, label:'I'},
    ];
}]);

function init(){
    new TimelineLite().to($('.scroller'),1.0,{'scrollTop':270,delay:1});
    socket = io();
    inverted = false;
    socket.on('start up',function(id) {
        console.log('We are Control Panel #'+id);
        socket.emit('init controller');
    });
    
    socket.on('set color', function(color,style){
        $('.accent').css({backgroundColor:color});
        $('.scroller').addClass(style);
    });
    
    $('.rightButton').click(function(e){
        socket.emit('primary click', accel);
    });
    
    $('.leftButton').click(function(e){
        socket.emit('secondary click', accel);
    });
    $('#R').click(function(e){
        socket.emit('reset cell');
    });
    $('#M').click(function(e){
        socket.emit('recolor');
    });
    $('#D').click(function(e){
        socket.emit('new cell');
    });
    $('#P').click(function(e){
        socket.emit('pause');
    });
    $('#I').click(function(e){
        inverted = !inverted;
    });
    
    lockedAllowed = window.screen.orientation.lock('landscape-primary');
    if (window.DeviceMotionEvent == undefined) {
        //No accelerometer is present. Use buttons. 
        //console.log("no accelerometer");
    } else {
        //console.log("accelerometer found");
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
    
    accel = {
        x: aX,
        y: aY,
        z: aZ,
        xTilt: xPosition,
        yTilt: yPosition
    }
    if(inverted) accel.yTilt *= -1;
    //console.log(aX+', '+aY+', '+aZ);
    //console.log(xPosition+', '+yPosition);
    socket.emit('accel', accel);
}