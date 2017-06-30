;(function() {
    //环境设置
    var curEnv = '<%=curEnv%>';

    var env = {
        test: {},
        staging: {},
        prod: {}
    };

    $.extend(window.ldl, env[curEnv]);
    
    ldl.curEnv = curEnv;
    ldl.errMonitor = 0;			//是否开启错误监控
    ldl.category = '';			//错误类别 用来区分不同的统计项目 不填则默认为error
})();