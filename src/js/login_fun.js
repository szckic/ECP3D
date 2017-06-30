//log in
$(document).ready(function(){

   if($.cookie('user')!=null){
    var user=JSON.parse($.cookie('user'));
    
    self.location="/conferenceList.html";
   }
});
function login(){
	// $.post("/login",JSON.stringify({username:$("input#username"),password:$("input#password")}),function(){
	// 	s

	// });

   //var wsurl="ws://127.0.0.1:9999";
   var wsurl="ws://www.dongqin.xin:9999";
var websocket=new WebSocket(wsurl);
websocket.onopen=function(evt){
   


websocket.onmessage=function(evt){
    
    var msg=JSON.parse(evt.data);
    if(msg.result=="done"){
        $.cookie('username',msg.username,{ expires: 1, path: '/' });
        $.cookie('user',JSON.stringify(msg));
        websocket.close();
        self.location="/conferenceList";
    }else{
        
        websocket.close();
    }
};

websocket.onclose=function(evt){
    
};


websocket.send(JSON.stringify({type:"login",username:$("input#username").val(),password:$("input#password").val()}));

};

   


}