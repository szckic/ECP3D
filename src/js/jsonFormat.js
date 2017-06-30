//json format
//create new conference
//require
{"type":"addConference",
 "conference":
    {"name":"conference1","modelId":"3062","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3062/20170504111118_Small.png","password":"12345"}
}
//reply
{"type":"addConference",
 "conference":
    {"name":"conference1","modelId":"3062","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3062/20170504111118_Small.png","password":"12345"},
 "result":"done"
}

{"type":"conferenceList",
 "conference":[
    {"name":"conference1","modelId":"3062","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3062/20170504111118_Small.png","password":"12345"},
    {"name":"conference1","modelId":"3124","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3124/20170504145826_Small.png","password":"12345"},
    {"name":"conference1","modelId":"7898","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1187996/7898/20170531194736_Small.png","password":"12345"}    
 ]
}

//add model
//require
{"type":"addModel"
 "model":
     {"name":"BMW","modelId":"3062","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3062/20170504111118_Small.png"}
}
//reply
{"type":"addModel"
 "model":
     {"name":"BMW","modelId":"3062","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3062/20170504111118_Small.png"},
 "result":"done"    
}

{"type":"modelList",
 "model":[
    {"name":"BMW","modelId":"3062","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3062/20170504111118_Small.png"},
    {"name":"挖掘机","modelId":"3124","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1113279/3124/20170504145826_Small.png"},
    {"name":"挖掘机2","modelId":"7898","img":"http://3dxiuxiufile.oss-cn-hangzhou.aliyuncs.com/source/1187996/7898/20170531194736_Small.png"}    
 ]
}

