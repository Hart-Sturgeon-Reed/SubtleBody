function setupOSC() {
    socket.on('osc', function(msg){
        var address = msg.address;
        var userId = msg.args[0].value;
        //console.log('OSC message recieved from user '+userId+', kind is '+address);
         
        //New Skeleton tracking
        if(address=="/New User"){
            if (!lightBodyCreated){
                var skeleton = newSkeleton(userId,msg.args);
                createLightBody(skeleton);
            }else if (!lightBodyVisible){
                lightBody.skeleton = skeleton;
                lightBodyVisible = true;
            }
        }else if(address=="/User Lost"){
            if (lightBodyCreated && lightBodyVisible){
                hideLightBody();
            }
        }else if(address=="/User Data"){
            if (lightBodyCreated){
                lightBodyVisible = true;
                stage.mandala.visible = true;
                lightBody.update(msg.args);
            }
        
        //Old Skeleton tracking
        }else if(address=="/Skeleton Added"){
            var cursor = addUser(userId+'L',false,SkeletonHand,Dancer1);
            var data = {
                x: msg.args[1].value,
                y: msg.args[2].value,
                z: msg.args[3].value
            };
            //cursor.setInitPos(data);
            cursor = addUser(userId+'T',false,SkeletonTorso,Dancer2);
            data = {
                x: msg.args[7].value,
                y: msg.args[8].value,
                z: msg.args[9].value
            };
            //cursor.setInitPos(data);
            cursor = addUser(userId+'R',false,SkeletonHand,Dancer1);
            data = {
                x: msg.args[4].value,
                y: msg.args[5].value,
                z: msg.args[6].value
            };
            //cursor.setInitPos(data);
            cursor = addUser(userId+'H',false,SkeletonHand,Dancer1);
            cursor = addUser(userId+'LK',false,SkeletonHand,Dancer2);
            cursor = addUser(userId+'RK',false,SkeletonHand,Dancer2);
        }else if(address=="/Skeleton Lost"){
            removeUser(userId+'L');
            removeUser(userId+'R');
            removeUser(userId+'T');
            removeUser(userId+'H');
            removeUser(userId+'LK');
            removeUser(userId+'RK');
        }else if(address=="/Skeleton") {
            var data = {
                x: msg.args[1].value,
                y: msg.args[2].value,
                z: msg.args[3].value,
                px: msg.args[4].value,
                py: msg.args[5].value
            };
            //console.log("L:");
            //console.dir(data);
            var torso = msg.args[18].value;
            var cursor = getCursor(userId+'L');
            if(cursor!=null){
                if(cursor.initPos.z == null){
                    cursor.setInitPos(data);
                }
                cursor.filterMotion.call(cursor,data,torso);
            }
            data = {
                x: msg.args[6].value,
                y: msg.args[7].value,
                z: msg.args[8].value,
                px: msg.args[9].value,
                py: msg.args[10].value
            };
            //console.log("R:");
            //console.dir(data);
            cursor = getCursor(userId+'R');
            if(cursor!=null){
                if(cursor.initPos.z == null){
                    cursor.setInitPos(data);
                }
                cursor.filterMotion.call(cursor,data,torso);
            }
            data = {
                x: msg.args[11].value,
                y: msg.args[12].value,
                z: msg.args[13].value,
                px: msg.args[14].value,
                py: msg.args[15].value
            };
            //console.log("T:");
            //console.dir(data);
            cursor = getCursor(userId+'T');
            if(cursor!=null){
                if(cursor.initPos.z == null){
                    cursor.setInitPos(data);
                }
                cursor.filterMotion.call(cursor,data);
            }
            data = {
                x: msg.args[16].value,
                y: msg.args[17].value,
                z: msg.args[18].value,
                px: msg.args[19].value,
                py: msg.args[20].value
            };
            //console.log("H:");
            //console.dir(data);
            cursor = getCursor(userId+'H');
            if(cursor!=null){
                if(cursor.initPos.z == null){
                    cursor.setInitPos(data);
                }
                cursor.filterMotion.call(cursor,data,torso);
            }
            data = {
                x: msg.args[21].value,
                y: msg.args[22].value,
                z: msg.args[23].value,
                px: msg.args[24].value,
                py: msg.args[25].value
            };
            //console.log("LK:");
            //console.dir(data);
            cursor = getCursor(userId+'LK');
            if(cursor!=null){
                if(cursor.initPos.z == null){
                    cursor.setInitPos(data);
                }
                cursor.filterMotion.call(cursor,data,torso);
            }
            data = {
                x: msg.args[26].value,
                y: msg.args[27].value,
                z: msg.args[28].value,
                px: msg.args[29].value,
                py: msg.args[30].value
            };
            //console.log("RK:");
            //console.dir(data);
            cursor = getCursor(userId+'RK');
            if(cursor!=null){
                if(cursor.initPos.z == null){
                    cursor.setInitPos(data);
                }
                cursor.filterMotion.call(cursor,data,torso);
            }
        }
    });
}