//conference link
//include xghashjs.js in parent file

function conferenceLink(conferenceName,modelId){
    return "//www.dongqin.xin/main.html?specialCode="+conferenceName+"&validateCode="+xghash(conferenceName)+"&modelId="+modelId;
}