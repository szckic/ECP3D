'use strict';
(function() {

    var ldl = window.ldl = {
        userData: {},
        version: '0.8.13'
    };

    include_js('//cdn.ledongli.cn/cdn-uploader/_1498113375484/fastclick.js');

    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);

    function include_js(path) {    
        var sobj = document.createElement('script');   
        sobj.type = "text/javascript";   
        sobj.src = path;   
        var headobj = document.getElementsByTagName('head')[0];   
        headobj.appendChild(sobj); 
    } 


    Array.prototype.unique = function(){

        this.sort(); //先排序

        var res = [this[0]];

        for(var i = 1; i < this.length; i++ ){
            if(this[i] !== res[res.length - 1]){
                res.push(this[i]);
            }
        }
        
        return res;
    }

    Array.prototype.contains = function (obj) {  
        var i = this.length;  
        
        while (i--) {  
            if (this[i] === obj) {  
                return true;  
            }  
        } 
       
        return false;  
    }  

    Array.prototype.except = function (obj) {
        var re = [];

        for(var i = 0;i<this.length; i++) {

            if(obj.indexOf(this[i]) < 0) {
                re.push(this[i]);
            }
        }
        return re;
    }

    //ua
    ;(function(ua, platform) {
        var os          = this.os = {},
            browser     = this.browser = {},
            webkit      = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
            android     = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            osx         = !!ua.match(/\(Macintosh\; Intel /),
            ipad        = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod        = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone      = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos       = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            win         = /Win\d{2}|Windows/.test(platform),
            wp          = ua.match(/Windows Phone ([\d.]+)/),
            touchpad    = webos && ua.match(/TouchPad/),
            kindle      = ua.match(/Kindle\/([\d.]+)/),
            silk        = ua.match(/Silk\/([\d._]+)/),
            blackberry  = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10        = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook    = ua.match(/PlayBook/),
            chrome      = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox     = ua.match(/Firefox\/([\d.]+)/),
            firefoxos   = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
            ie          = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
            webview     = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
            safari      = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
        if (wp) os.wp = true, os.version = wp[1]
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
        if (chrome) browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.firefox = true, browser.version = firefox[1]
        if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
        if (ie) browser.ie = true, browser.version = ie[1]
        if (safari && (osx || os.ios || win)) {
            browser.safari = true
            if (!os.ios) browser.version = safari[1]
        }
        if (webview) browser.webview = true

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
            (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
        os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
            (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))

        this.isIos = this.os.ios;
        this.isAndroid = this.os.android;
        this.isWeixin = ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger";

        var match = ua.match(/(?:(cn\.ledongli\.Runner(?:\.test)?)|(cc\.fenzi\.xiaoqin(?:-internal)?(?:\.test)?)|(cn\.ledongli\.ldl(?:\.test)?))\/([0-9_.]+)$/i);

        if (match) {
            //判断乐动力和跑步
            this.isApp = true;
            this.app = {};
            this.app.name = match[0].match(/runner/i) ? 'runner' : 'ledongli';
            this.app.version = match[4];
        } else {
            // 判断S计划
            match = ua.match(/(?:(cn\.ledongli\.spt(?:\.test)?)|(cn\.ledongli\.sps(?:\.test)?)|(cn\.ledongli\.Slimfastteacher)|(cn\.ledongli\.Slimfaststudent))\/([0-9_.]+)$/i);
            if (match) {
                this.isApp = true;
                this.app = {};
                this.app.name = match[0].match(/Slimfastteacher|spt/i) ? 's_teacher' : 's_student';
                this.app.version = match[5];
            }
        }

    }).call(ldl, navigator.userAgent, navigator.platform);

    ;(function() {
        var observer = {
            on: function(type, callback) {
                if (typeof callback === 'function') {
                    if (!this._events) this._events = {};
                    if (!this._events[type]) this._events[type] = [];

                    this._events[type].push(callback);
                }
                return this;
            },
            one: function(type, callback) {
                if (typeof callback === 'function') {
                    var self = this,
                        fn = function() {
                            callback();
                            self.off(type, fn);
                        };
                    this.on(type, fn);
                }
                return this;
            },
            off: function(type, callback) {
                if (!this._events || !this._events[type]) return this;

                for (var i = 0; i < this._events[type].length; i++) {
                    if (this._events[type][i] === callback)
                        delete this._events[type][i];
                }
                return this;
            },
            trigger: function(type) {
                if (!this._events || !this._events[type]) return this;

                var args = [].slice.call(arguments, 1);
                for (var i = 0; i < this._events[type].length; i++) {
                    if (typeof this._events[type][i] === 'function')
                        this._events[type][i].apply(null, args);
                }
                return this;
            }
        };

        ldl.makeObserver = function(o) {
            for (var i in observer) {
                if (observer.hasOwnProperty(i)) {
                    o[i] = observer[i];
                    o._events = {};
                }
            }
        };

        ldl.makeObserver(ldl);

        // 报错统计
        $(window).on('error', function(e) {
            ldl.trigger('error', 'error msg: ' + e.message + ' / ' + e.filename + ' / ' + e.lineno);
        });

        ldl.on("error", function(msg) {
            ldl.errMonitor && $.post('//121.43.145.85:3081/error', {category: ldl.category||'error', err: msg + ' / ' + location.href + ' / ' + navigator.userAgent + ' / userData : ' + (ldl.userData ? (JSON.stringify(ldl.userData)) : ''), mail: ldl.mail});
        });
    })();


    //检测依赖
    (function() {
        if (!window.$ || !window.$.Deferred) throw new Error('Need zepto with Deferred!!!');
    })();

    ldl.isSupportStorage = function() {
        var isSupport = true;
        try {
            localStorage.test = 'test';
            delete localStorage.test;
        } catch (e) {
            isSupport = false;
        }

        return isSupport;
    }();

    //微信授权 取微信数据
    (function() {
        var _wxAuthorize = {
                code: function() {
                    var params = ldl.getUrlObj(),
                        code = params.search.code;

                    if (!code) return $.Deferred().reject('缺少code');

                    return ldl.getData('//walk.ledongli.cn:8090/v2/rest/users/accesstokenwechatweb', {
                        code: code
                    }).then(function(d) {
                        return d.errorCode == 0 ? $.Deferred().resolve(d) : $.Deferred().reject('code无效');
                    });
                },
                refreshToken: function(token) {
                    if (token) {
                        return ldl.getData('//walk.ledongli.cn:8090/v2/rest/users/refreshtokenwechatweb', {
                            refresh_token: token
                        }).then(function(d) {
                            if (d.errorCode == 0) {
                                return $.Deferred().resolve(d);
                            } else {
                                //refresh_token也超时了 必须要用户重新授权
                                if (ldl.isSupportStorage && sessionStorage._userData) delete sessionStorage._userData;
                                return $.Deferred().reject('请重新授权登录');
                            }
                        });
                    }
                    return $.Deferred().reject('refresh_token无效');
                }

            },

            _authorizeByWeixin = function(type, data) {
                return _wxAuthorize[type] ? _wxAuthorize[type](data) : $.Deferred.reject('没找到这种授权方式:' + type);
            },

            _saveUserToSession = function(name, data) {
                //保存到session
                if (ldl.isSupportStorage && data) {
                    sessionStorage[name] = JSON.stringify(data);
                }
            };

        ldl.getUserDataInWeixin = function() {
            var userData;
            if (ldl.isSupportStorage && sessionStorage._userData) {
                userData = JSON.parse(sessionStorage._userData);
            }

            if (userData && userData.src == 'wechat') {
                //保存过数据
                $.extend(ldl.userData, userData);
                //access_token没有超时
                if (userData.expires > +new Date) return $.Deferred().resolve();
                //access_token超时 需要刷新授权
                else {
                    return _authorizeByWeixin('refreshToken', userData.refresh_token)
                        .done(function(d) {
                            ldl.userData.access_token = d.ret.access_token,
                            ldl.userData.refresh_token = d.ret.refresh_token,
                            ldl.userData.openid = d.ret.openid,
                            ldl.userData.expires = d.ret.expires_in * 1000 + +new Date;

                            _saveUserToSession('_userData', ldl.userData);
                        });
                }
            } else {
                //需要重新获取数据
                if (ldl.isSupportStorage && sessionStorage._userData) delete sessionStorage._userData;

                return _authorizeByWeixin('code').done(function(d) {
                    if (d.errorCode === 0) {
                        ldl.userData.access_token = d.ret.access_token;
                        ldl.userData.refresh_token = d.ret.refresh_token;
                        ldl.userData.openid = d.ret.openid;
                        ldl.userData.uid = d.ret.uid;
                        ldl.userData.unionid = d.ret.unionid;
                        ldl.userData.expires = d.ret.expires_in * 1000 + +new Date;
                        ldl.userData.src = 'wechat';

                        _saveUserToSession('_userData', ldl.userData);
                    }
                });
            }
        };
    })();
    
    ldl.weixin = function() {
        var deferred,

            init = function(appId, appName, wxType, debug) {
                if (deferred) return deferred.promise();
                deferred = $.Deferred();

                var wxScript = document.createElement('script');
                var wxUrl  = '//common.ledongli.cn/common_service/wechat/js_sign';//默认为开放平台的wx接口； 
                if (wxType == 'mp') wxUrl = '//sprogram.ledongli.cn/v1/rest/recruit/wechat_jsapi_ticket';

                wxScript.src = '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
                wxScript.onload = function() {
                    ldl.getData(wxUrl, {
                        url: encodeURIComponent(location.href),
                        app: appName || 'ledongli'
                    })
                        .done(function(d) {
                            wx.config({
                                debug: debug,
                                appId: appId || 'wx13e719bc136549a8', //默认用乐动力appId
                                timestamp: d.ret.timestamp,
                                nonceStr: d.ret.nonceStr,
                                signature: d.ret.signature,
                                jsApiList: [
                                    'onMenuShareTimeline',
                                    'onMenuShareAppMessage',
                                    'onMenuShareQQ',
                                    'onMenuShareWeibo',
                                    'openLocation',
                                    'getLocation',
                                    'chooseWXPay',
                                    'scanQRCode'
                                ]
                            });
                            deferred.resolve();
                        })
                        .fail(deferred.reject);
                };
                document.body.appendChild(wxScript);

                return deferred.promise();
            },

            run = function(fn, data) {
                if (!deferred) {
                    return init(data.appId, data.appName, data.wxType, data.debug).done(function() {
                        wx.ready(fn);
                    });
                }
                deferred.done(fn);
            };

        return {
            share: function(data) {
                run(function() {
                    wx.onMenuShareAppMessage(data);
                    wx.onMenuShareTimeline(data);
                    wx.onMenuShareQQ(data);
                    wx.onMenuShareWeibo(data);
                }, data)
            },
            getLocation: function(data) {
                run(function() {
                    wx.getLocation({
                        type: data.type || 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: data.success,
                        fail: data.fail,
                        complete: data.complete,
                        cancel: data.cancel
                    });
                }, data)
            },
            pay: function(data) {
                // todo
                run(function() {
                    wx.chooseWXPay({
                        timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id =***）
                        signType: data.signType || 'SHA1', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: data.paySign, // 支付签名
                        success: data.success,
                        fail: data.fail,
                        complete: data.complete,
                        cancel: data.cancel
                    });
                }, data)
            },
            // scanQRCode: function(data) {
            //     run(function(){
            //         wx.scanQRCode({
            //             needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            //             scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            //             success: function (res) {
            //                 var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            //             }
            //         });
            //     }, data)
            // }
            // 
            scanQRCode: function(data) {
                run(function() {
                    wx.scanQRCode(data);
                    // needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    // scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    // success: function (res) {
                    // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    // }
                }, data)
            }
        }

    }();

    ldl._initAppjs = function initAppjs() {
        if (!ldl.isApp) return $.Deferred().reject();
        if (initAppjs.deferred) return initAppjs.deferred.promise();

        var deferred = $.Deferred(),
            init = function() {
                ldl.isApp = true;
                WebViewJavascriptBridge.init();
                deferred.resolve();
            };

        initAppjs.deferred = deferred;

        setTimeout(function() {
            deferred.reject('initAppjs time out')
        }, 5000);

        window.WebViewJavascriptBridge ? init() : document.addEventListener('WebViewJavascriptBridgeReady', init, false);

        return deferred.promise();
    }

    ldl.callNative = function(action, data, timeout){
        // 目前只有requestData 接受js对象
        if (action != 'requestData' && data && typeof data == 'object') data = JSON.stringify(data);

        var def = $.Deferred();
        if (timeout > 0)
            setTimeout(function() {
                def.reject('time out');
            }, timeout);

        ldl._initAppjs().done(function() {
            if (action == 'payDone') {
                WebViewJavascriptBridge.registerHandler('payDone', function(data, cb){
                    def.resolve(data);
                    // cb();
                });
            }else {
                WebViewJavascriptBridge.callHandler(action, data, def.resolve);
            }
            
        }).fail(def.reject);

        return def.promise();
    }

    ldl.regNative = function(action){
        var def = $.Deferred();

        ldl._initAppjs().done(function() {
            WebViewJavascriptBridge.registerHandler(action, function(data, cb) {
                def.resolve(data);
                // cb();
            });
        }).fail(def.reject);

        return def.promise();
    }

    ldl.callNativeTmp = function(action, data, timeout) {
        // 目前只有requestData 接受js对象
        if (action != 'requestData' && data && typeof data == 'object') data = JSON.stringify(data);

        var def = $.Deferred();
        ldl.loadAppJs().done(function() {
            // loadAppJs 为了兼容老版本api
            if (ldl.isAndroid && window.web && typeof window.web[action] == 'function') {
                //兼容安卓老版本
                var d;
                try{
                    d = typeof data != 'undefined' ? web[action](data) : web[action]();
                } catch(e) {
                    ldl.trigger('error', 'error msg: failed to call Android native method ['+ action + ']');
                }
                def.resolve(d);
            } else {
                ldl.callNative(action, data, timeout).done(def.resolve);
            }
        });
        return def.promise();
    }

    //初始化app接口 获取app数据
    ldl.loadAppJs = function loadAppJs() {
        if (loadAppJs.deferred) return loadAppJs.deferred.promise();

        var fnNames = "login getAppInfo getUserId getUserInfo getWebCondition getActivitywithData setUserGoalWithData getDailyStatsWithData openURLWithData getCurrentLocation setWebViewShare openWithWebView launchWeChatPay updateShareModel chooseImage tapUserinfo tapShare".split(" "),
            deferred = $.Deferred();

        setTimeout(function() {
            deferred.reject('app接口检测超时');
        }, 5000);

        ldl.app = ldl.app || {};
        loadAppJs.deferred = deferred;

        if (ldl.isIos) {
            ldl._initAppjs().done(function() {
                fnNames.forEach(function(name) {
                    ldl.app[name] = (function(method) {
                        return function fn(data) {
                            if (!loadAppJs.deferred) {
                                return loadAppJs().then(function() {
                                    return fn();
                                });
                            }
                            var def= $.Deferred();
                            try{
                                WebViewJavascriptBridge.callHandler(method, data, def.resolve);
                            } catch(e) {
                                ldl.trigger('error', 'error msg: failed to call Ios native method ['+ method + ']');
                            }
                            return def.promise();
                        };
                    })(name);
                });

                deferred.resolve();
            })
            .fail(deferred.reject);
        } else if (ldl.isAndroid && (typeof web != 'undefined' && typeof web.getUserInfo == 'function' || ldl.isApp) ) {
            fnNames.forEach(function(name) {
                ldl.app[name] = (function(method) {
                    return function(data) {
                        try{
                            var d = typeof data != 'undefined' ? web[method](data) : web[method]();
                            return $.Deferred().resolve(d);
                        } catch(e) {
                            ldl.trigger('error', 'error msg: failed to call Android native method ['+ method + ']');
                        }
                    };
                })(name);
            });

            deferred.resolve();
        }

        return deferred.promise();
    };

    // ldl.getUserDataInapp = function() {
    //     if (!ldl.isApp) return $.Deferred().reject('不在app里');

    //     return  ldl.callNativeTmp('getUserInfo').then(function(res){
    //                 var deferred = $.Deferred();
    //                 try{
    //                     var o = JSON.parse(res);
    //                     ldl.userData = o;
    //                     deferred.resolve(o);
    //                 } catch(e) {
    //                     deferred.reject('获取用户信息失败');
    //                 }
    //                 return deferred.promise();
    //             });
    // };

    /**
     * get user data in app
     * @return {deferred}
     */
    ldl.getUserDataInapp = function() {
        if (!ldl.isApp) return $.Deferred().reject('不在app里');

        return  ldl.callNative('getUserInfo').then(function(res){
                    var deferred = $.Deferred();
                    try{
                        var o = JSON.parse(res);
                        ldl.userData = o;
                        deferred.resolve(o);
                    } catch(e) {
                        deferred.reject('获取用户信息失败:' + res);
                    }
                    return deferred.promise();
                });
    };

    //处理错误码
    ldl.handleErrorCode = function(errorCode, config) {
        var errCodeMap = {
            '-10001': '授权失败',
            '-10002': '微信授权失败',
        };

        config.codeMap && $.extend(errCodeMap, config.codeMap);

        if (config && config.ecHandler && typeof config.ecHandler[errorCode] == 'function') {
            config.ecHandler[errorCode]();
        } else if (config && typeof config.handler == 'function') {
            config.handler(errCodeMap[errorCode]);
        } else ldl.gModalTip.show('<span style="white-space:nowrap;">' + (errCodeMap[errorCode] || '出错了') + '</span>', config && config.holdTime || 3000);
    };

    ldl.getUserData = function() {
        return ldl.isWeixin ? ldl.getUserDataInWeixin() : ldl.getUserDataInapp();
    }

    ldl.shareBy = function() {
        var _shareBy = function(type, data) {
                return typeof share[type] == 'function' && share[type](data);
            },
            share = {
                app: function(data) {
                    ldl.app.name == 'runner' ? ldl.callNativeTmp('updateShareModel', data) : ldl.callNativeTmp('setWebViewShare', data); 
                },
                weixin: function(data) {
                    ldl.weixin.share(data);
                }
            };
        return _shareBy;
    }();

    //处理页面跳转
    ;(function() {
        if (!ldl.isSupportStorage) return ldl.trigger('error', 'error msg: storage not supportted');

        $(window).on('pageshow', function(e) {
            var data = sessionStorage._pageData && JSON.parse(sessionStorage._pageData);
            if (data) delete sessionStorage._pageData;

            ldl.trigger('pageShow', data);

            if (e.persisted) {
                ldl.trigger('pageResume', data);
            } else {
                typeof data != 'undefined' ? ldl.trigger('pageResume', data) : ldl.trigger('pageCreate');
            }

        });

        ldl.goBack = function(num, data) {
            if (typeof data != 'undefined') sessionStorage._pageData = JSON.stringify(data);
            history.go(num || -1);
        };

        ldl.goTo = function(url, data) {
            if (typeof data != 'undefined') sessionStorage._pageData = JSON.stringify(data);
            location.href = url;
        };
    })();

    ldl.script = function() {
        var _loadedScripts = {};

        return {
            load: function() {
                var arr = [];
                [].slice.call(arguments).forEach(function(param) {
                    var url = param[0],
                        ver = param[1] || '0.0';

                    if (_loadedScripts[url] && _loadedScripts[url].ver === ver) {
                        var curDeferred = _loadedScripts[url].deferred;
                        if (arr.every(function(d) {
                            return d !== curDeferred
                        })) {
                            arr.push(curDeferred);
                        }
                    } else {
                        arr.push(_load(url, ver));
                    }
                });

                return arr.reduce(function(a, b) {
                    return a.then(function() {
                        return b;
                    }).done(_runScript);
                }, $.Deferred().resolve());
            }
        }

        function _runScript(str) {
            if (typeof str == 'undefined') return;
            var $script = document.createElement('script');
            $script.innerHTML = str;
            document.body.appendChild($script);
            document.body.removeChild($script);
        }

        function _load(url, version) {
            if (typeof version == 'undefined') version = '0.0';

            var script = localStorage[url];
            if (script) {
                script = JSON.parse(script);

                if (script.s && script.v === version) {
                    var deferred = $.Deferred();
                    _loadedScripts[url] = {
                        ver: version,
                        script: script.s,
                        deferred: deferred,
                    };
                    return deferred.resolve(script.s);
                } else {
                    delete _loadedScripts[url];
                    return loadScript();
                }

            } else {
                return loadScript();
            }

            function loadScript() {
                var deferred = $.Deferred();

                _loadedScripts[url] = {
                    ver: version,
                    deferred: deferred
                };

                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'text',
                    cache: false,
                    timeout: 5000,
                    success: function(d) {
                        var script = {
                            v: version,
                            s: d
                        };
                        localStorage[url] = JSON.stringify(script);
                        _loadedScripts[url].script = d;

                        deferred.resolve(d);
                    },
                    error: function(xhr) {
                        delete _loadedScripts[url];

                        if (xhr.status >= 500)
                            deferred.reject('服务器出去跑步了');
                        else if (xhr.status >= 400)
                            deferred.reject('没找到页面');
                        else
                            deferred.reject('网络错误');
                    }
                });

                return deferred;
            }
        }
    }();

    ldl.obj2str = function(params) {
        var url = '';
        $.each(params, function(key, value) {
            url += '&' + key + '=' + value;
        });

        return url.substr(1);
    }

    ldl.str2obj = function(str) {
        var re = {};
        str.split('&').forEach(function(v) {
            var arr = v.split('=');
            if (arr[0]) re[arr[0]] = arr[1];
        });
        return re;
    }

    ldl.getUrlObj = function(url) {
        var a = document.createElement('a'),
            search, hash,
            re = {
                search: {},
                hash: {}
            };

        a.href = url || location.href;
        search = a.search;
        hash = a.hash;

        if (search) re.search = ldl.str2obj(search.substr(1));
        if (hash) re.hash = ldl.str2obj(hash.substr(1));

        return re;
    }

    ldl.lazyLoad = function($el) {
        $el.find('img[lazy-src]').each(function(i, pic) {
            var $pic = $(pic),
                src = $pic.attr('lazy-src');
            if (src) {
                var img = new Image;
                img.src = src;
                img.onload = function() {
                    $pic.attr({
                        src: src,
                        'lazy-src': undefined
                    });
                };
            }
        });
    }

    ldl.makeScrollLoader = function(options) {
        var _isTouching = false,
            dx, x,
            dy, y,
            state,
            config = {
                root: $('body'),
                checkFn: function() {
                    return false
                },
                callback: null
            },
            throttleTm = ldl.debounce(_handleTm, 300),
            callbacks = [],

            that = {
                start: function() {
                    if (state != 'on') {
                        state = 'on';
                        config.root
                            .on('touchstart', _handleTs)
                            .on('touchmove', throttleTm);
                    }
                },
                stop: function() {
                    if (state != 'off') {
                        state = 'off';
                        config.root
                            .off('touchstart', _handleTs)
                            .off('touchmove', throttleTm);
                    }
                },
                add: function(fn) {
                    if (typeof fn == 'function') callbacks.push(fn);
                },
                del: function(fn) {
                    if (typeof fn != 'function') return;
                    callbacks.every(function(f, i) {
                        if (fn === f) {
                            delete callbacks[i];
                            return false;
                        }
                        return true;
                    });
                },
                getState: function() {
                    return state;
                }
            };

        $.extend(config, options);

        that.add(config.callback);

        return that;

        function _handleTs(e) {
            _isTouching = true;
            x = e.touches[0].screenX;
            y = e.touches[0].screenY;
        }

        function _handleTe(e) {
            //安卓4下有bug，如果body滚动则不触发touchend事件
            if (_isTouching) {
                _isTouching = false;

                dx = e.changedTouches[0].screenX - x;
                dy = e.changedTouches[0].screenY - y;

                if (config.checkFn({
                    dx: dx,
                    dy: dy
                })) {
                    callbacks.forEach(function(fn) {
                        fn();
                    });
                }
            }
        }

        function _handleTm(e) {
            if (_isTouching) {
                _isTouching = false;

                dx = e.touches[0].screenX - x;
                dy = e.touches[0].screenY - y;

                if (config.checkFn({
                    dx: dx,
                    dy: dy
                })) {
                    callbacks.forEach(function(fn) {
                        fn();
                    });
                }
            }
        }
    };

    ldl.getData = function(url, data, times, timeout) {
        var timeFailed = 0,
            maxTimes = times < 1 ? 1 : times,
            deferred = $.Deferred(),
            getDataAndTry = function() {
                getData(url, data)
                    .done(function(d) {
                        deferred.resolve(d);
                    })
                    .fail(function(err) {
                        ++timeFailed < maxTimes ? getDataAndTry() : deferred.reject(err);
                    });
                return deferred.promise();
            },
            getData = function() {
                var deferred = $.Deferred();

                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'jsonp',
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function() {
                        deferred.reject('服务器出去跑步了～');
                    },
                    timeout: timeout || 8000
                });

                return deferred.promise();
            }

        return getDataAndTry();
    }

    ldl.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : +new Date;
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = +new Date;
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    ldl.debounce = function(func, wait, immediate) {
        var tid;
        return function() {
            var o = this,
                args = arguments;
            var later = function() {
                tid = null;
                if (!immediate) func.apply(o, args);
            };
            var callNow = immediate && !tid;
            clearTimeout(tid);
            tid = setTimeout(later, wait);
            if (callNow) func.apply(o, args);
        };
    };


    ldl.var = {
        get: function(name, nameInUrl) {
            var params = ldl.getUrlObj().search;
            var val = params[nameInUrl || name];

            if (val) {
                if (val == 'undefined') {
                    ldl.storage.del(name);
                    val = null;
                } else {
                    ldl.storage.set(name,val);
                }
            } else {
                val = ldl.storage.get(name);
            }

            return val ? decodeURIComponent(val) : null;
        }
    };

    ldl.cookie = function() {
        function getCookie(name) {
            // var exp = new RegExp("(?:;)?" + encodeURIComponent(name) + "=([^;]*);?");
            // if (exp.test(document.cookie))
            //     return decodeURIComponent(RegExp['$1']);
            // else return null;
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
            else
            return null;
        }

        function setCookie(name, value, expires, path, domain) {
            if (expires && !isNaN(expires)) expires = new Date(new Date().getTime() + expires);
            document.cookie = name + "=" + escape(value) + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "; path=/") + (domain ? ";domain=" + domain : "");
        }

        function deleteCookie(name) {
            document.cookie = encodeURIComponent(name) + "=0;expires=Fri, 02-Jan-1970 00:00:00 GMT;path=/";
        }

        return {
            get: getCookie,
            set: setCookie,
            del: deleteCookie
        }

    }();

    ldl.tmpl = function() {
        var cache = {};

        return function tmpl(str, data) {
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") + "');}return p.join('');");

            return data ? fn(data) : fn;
        };

    }();

    ldl.Tabs = function() {
        this.init.apply(this, arguments);
    }

    $.extend(ldl.Tabs.prototype, {

        init: function($container, selector, defferedFn) {
            var $tabs, o = this;

            selector = selector || '.tab[data-type]';

            $tabs = $container.find(selector);

            $tabs.on('tap', function() {
                var $curTab = $(this),
                    params = {
                        index: +$curTab.data('index'),
                        type: $curTab.data('type')
                    };

                if (o.curType == params.type) return;
                else o.curType = params.type;

                o.trigger('tabChanged', params);

                if (typeof defferedFn == 'function')
                    defferedFn && defferedFn(params).then(function() {
                        $curTab.addClass('on').siblings().removeClass('on');
                    });
                else
                    $curTab.addClass('on').siblings().removeClass('on');

            }).each(function(i) {
                $(this).data('index', i);
            });

            this.curType = $tabs.filter('.on').data('type');

            this.container = $container;
            this.tabs = $tabs;

            ldl.makeObserver(this);
        },
        switchTo: function(type) {
            this.tabs.filter('[data-type=' + type + ']').trigger('tap');
        }

    });

    ;
    (function() {
        // validates
        var _validates = {
            maxLen: function(value, len) {
                return value.length <= len;
            },
            minLen: function(value, len) {
                return value.length >= len;
            },
            len: function(value, len) {
                return value.length == +len;
            },
            tel: function(value) {
                return /^(0|86|17951)?(1[0-9]{2})[0-9]{8}$/.test(value);
            },
            idCard: function(value) {
                return /^(([0-9]{17}[0-9X]{1})|([0-9]{15}))$/.test(value);
            },
            mail: function(value) {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/.test(value);
            },
            zipCode: function(value) {
                return /^[1-9]\d{5}(?!\d)$/.test(value);
            },
            nickName: function(value) {
                return /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(value);
            },
            required: function(value) {
                console.log(value);
                return value.length > 0;
            },
            number: function(value) {
                return !/\D/.test(value);
            },
            password: function(value) {
                return !/\W/.test(value);
            },
            gt: function(value, num) {
                return Number(value) > num;
            },
            lt: function(value, num) {
                return Number(value) < num;
            },
            gte: function(value, num) {
                return Number(value) >= num;
            },
            lte: function(value, num) {
                return Number(value) <= num;
            },
            beTrue: function(value) {
                return !!value;
            },
            beFalse: function(value) {
                return !value;
            }
        }

        var _commonValidate = function($el) {
            // 一般性校验只检查value
            // data-validate = "maxLen:20,phoneNum"
            // 没有设定检验函数 直接通过
            var validateString = $el.data('validate');
            if (!validateString || !validateString.trim().length) return true;

            var validates = validateString.split(','),
                len = validates.length,
                value = $el.val().trim(),
                method, params;

            while (len-- > 0) {
                method = validates[len].split(':')[0];
                params = validates[len].split(':')[1];

                if (params) {
                    params = params.split('|');
                    params.unshift(value);
                } else params = [value];

                if (!_validates[method] || !_validates[method].apply(null, params)) {
                    // $el[0].scrollIntoView && $el[0].scrollIntoView();
                    return false;
                }
            }

            return true;
        };

        ldl.validate = function(method, data) {
            return _validates[method](data);
        }

        ldl.Formfuc = function() {
            this.init.apply(this, arguments);
        };
        $.extend(ldl.Formfuc.prototype, {
            init: function($form, params) {

                this.checkTypes = '[data-validate]'; // 默认只对'data-validate'做验证
                this.cancelSubmit = false; //如果为false，需要手动设置为true来触发submit
                this.cancelValidate = false; //如果为false，需要手动设置为true来触发校验

                this.form = $form;
                // this.formBlocks     = $form.find('.formBlock');
                this.submitBtn = $form.find('[data-type=submit]');
                this.ckBtns = $form.find('[data-type=checkBox]');
                this.validateFns = $.extend(true, {}, _validates);
                this.errTarget = null; //用作错误提示

                params && $.extend(this, params);

                // 提交按钮
                var o = this;
                this.submitBtn.on('click', ldl.throttle(function(e) {
                    if (o.cancelSubmit) return;

                    (o.cancelValidate || o.validate()) ? o.onSubmit() : o.validateFail();
                }, 2000, {
                    trailing: false
                }))
                    .on('click', function(e) {
                        !o.cancelSubmit && e.preventDefault();
                    });

                this.ckBtns.on('tap', function() {
                    $(this).toggleClass('on');
                });
            },
            validate: function() {
                var isValid = true,
                    o = this;

                this.form.find(this.checkTypes).each(function() {
                    var $this = $(this),
                        type = $this.data('validate');
alert($this.val());
                    isValid = _commonValidate($this);
                    if (!isValid) {
                        if (!o.errTarget) o.errTarget = $this;
                        return false;
                    }
                    if (o.errTarget) {
                        o.errTarget.errTip.remove();
                        o.errTarget = null;
                    }
                });

                if (isValid) o.errTarget = null;

                return isValid;
            },
            validateFail: function() {
                var $el = this.errTarget;

                if (!$el.errTip) {
                    // $el.errTip = $('<div class="errTip">' + this.errTarget.data('msg') + '</div>');
                    $el.errTip = $('<div class="errTip">'+ this.errTarget.data('msg') +'</div>');
                    this.errTarget.closest('.inputArea').append($el.errTip);
                    

                } else {
                    $('.errTip').show();

                    $el.errTip.one('animationend webkitAnimationEnd', function() {
                        $el.removeClass('validateFailed');
                    }).addClass('validateFailed');
                }

                var t = setTimeout('$(".errTip").hide()', 3000);
            },
            onSubmit: function(url) {
                return ldl.getData(url).done(this.done).fail(this.fail);
            },
            addValidate: function(type, fn) {
                if (!this.validates[type]) this.validates[type] = fn;
            },
        });
    })();

    ldl.makeTip = function(options) {
        var defaults = {
                tpl: '',
                el: '.txt',
                root: 'body',
                duration: 3000,
                preventScroll: false,
                fixAdBlock: true
            },
            config = $.extend({}, defaults, options),
            $tip = $(config.tpl),
            $doc = $(document.body),
            preventScroll = config.preventScroll,
            prevented = false,
            fixAdBlock = config.fixAdBlock;

        if (fixAdBlock) {
            $tip.css({
                'position': 'absolute',
                'visibility': 'hidden'
            });
        }

        return {
            getEl: function() {
                return $tip;
            },
            show: function(s, duration, done) {
                if ($tip.length === 0) return;

                if (typeof this.done == 'function') {
                    //如果之前已经存在回调，立刻执行
                    this.done();
                    this.done = null;
                }

                this._tid && clearTimeout(this._tid);
                this.done = done;
                duration = duration > -1 ? duration : config.duration;

                $tip.find(config.el).html(s);
                $tip.appendTo($(config.root)).show();

                if (fixAdBlock)
                    setTimeout(function() {
                        $tip.css({
                            'position': 'fixed',
                            'visibility': 'visible'
                        });
                    }, 10);

                if (duration) this._tid = setTimeout(this.hide.bind(this), duration);

                if (preventScroll && !prevented) {
                    prevented = true;
                    $doc.on('touchmove', preventScrollFn);
                }
            },
            hide: function() {
                // todo 需要考虑多次show的情况

                if (fixAdBlock) {
                    $tip.css({
                        'position': 'absolute',
                        'visibility': 'hidden'
                    });
                }

                $tip.detach();
                if (preventScroll && prevented) {
                    $doc.off('touchmove', preventScrollFn);
                    prevented = false;
                }

                if (typeof this.done == 'function') {
                    this.done();
                    this.done = null;
                }
            }
        }

        function preventScrollFn(e) {
            e.preventDefault();
        }
    }

    ldl.getLocation = function(options) {
        var deferred = $.Deferred(),
            defaults = {
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 2000
            },
            config = options ? $.extend({}, defaults, options) : defaults,
            tid = setTimeout(function() {
                deferred.reject('请求用户地理位置超时');
            }, 10000);


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                clearTimeout(tid);
                deferred.resolve(position);
            }, function(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        deferred.reject("用户拒绝对获取地理位置的请求");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        deferred.reject("位置信息不可用");
                        break;
                    case error.TIMEOUT:
                        deferred.reject("请求用户地理位置超时");
                        break;
                    case error.UNKNOWN_ERROR:
                        deferred.reject("未知错误");
                }
            }, config);
          
        } else {
            deferred.reject('浏览器不支持获取位置信息')
        }
        return deferred.promise();
    }

    ldl.padnumber = function(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }

    //全局提示
    ldl.gTip = ldl.makeTip({
        tpl: '<div style="position:fixed;left:50%;top:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);background-color:rgba(0,0,0,.5);z-index:200;padding:5px 15px;border-radius:3px;line-height:20px;color:white;font-size:16px;text-align:center;"><div class="txt"></div></div>'
    });

    // 全局模态提示
    ldl.gModalTip = ldl.makeTip({
        tpl: '<div style="left:0px;top:0px;width:100%;height:100%;z-index:200;position:fixed;"><div class="gTip" style="position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);background-color:rgba(0,0,0,.5);z-index:200;padding:5px 15px;border-radius:3px;line-height:20px;color:white;font-size:16px;text-align:center;"><div class="txt"></div></div></div>'
    });

    // 全局模态提示
    ldl.gModalLoading = ldl.makeTip({
        tpl: '<div style="left:0px;top:0px;width:100%;height:100%;z-index:200;position:fixed;background:rgba(0, 0, 0, 0.5);"><div style="position:fixed;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%, -50%);background-color:rgba(0, 0, 0, 0.5);z-index:201;padding:5px 15px;border-radius:3px;line-height:20px;color:white;font-size:16px;text-align:center;padding-left:20px;background:url(\'data:image/gif;base64,R0lGODlhIAAgALMAAP///7Ozs/v7+9bW1uHh4fLy8rq6uoGBgTQ0NAEBARsbG8TExJeXl/39/VRUVAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBQAAACwAAAAAIAAgAAAE5xDISSlLrOrNp0pKNRCdFhxVolJLEJQUoSgOpSYT4RowNSsvyW1icA16k8MMMRkCBjskBTFDAZyuAEkqCfxIQ2hgQRFvAQEEIjNxVDW6XNE4YagRjuBCwe60smQUDnd4Rz1ZAQZnFAGDd0hihh12CEE9kjAEVlycXIg7BAsMB6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YEvpJivxNaGmLHT0VnOgGYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ/V/nmOM82XiHQjYKhKP1oZmADdEAAAh+QQFBQAAACwAAAAAGAAXAAAEchDISasKNeuJFKoHs4mUYlJIkmjIV54Soypsa0wmLSnqoTEtBw52mG0AjhYpBxioEqRNy8V0qFzNw+GGwlJki4lBqx1IBgjMkRIghwjrzcDti2/Gh7D9qN774wQGAYOEfwCChIV/gYmDho+QkZKTR3p7EQAh+QQFBQAAACwBAAAAHQAOAAAEchDISWdANesNHHJZwE2DUSEo5SjKKB2HOKGYFLD1CB/DnEoIlkti2PlyuKGEATMBaAACSyGbEDYD4zN1YIEmh0SCQQgYehNmTNNaKsQJXmBuuEYPi9ECAU/UFnNzeUp9VBQEBoFOLmFxWHNoQw6RWEocEQAh+QQFBQAAACwHAAAAGQARAAAEaRDICdZZNOvNDsvfBhBDdpwZgohBgE3nQaki0AYEjEqOGmqDlkEnAzBUjhrA0CoBYhLVSkm4SaAAWkahCFAWTU0A4RxzFWJnzXFWJJWb9pTihRu5dvghl+/7NQmBggo/fYKHCX8AiAmEEQAh+QQFBQAAACwOAAAAEgAYAAAEZXCwAaq9ODAMDOUAI17McYDhWA3mCYpb1RooXBktmsbt944BU6zCQCBQiwPB4jAihiCK86irTB20qvWp7Xq/FYV4TNWNz4oqWoEIgL0HX/eQSLi69boCikTkE2VVDAp5d1p0CW4RACH5BAUFAAAALA4AAAASAB4AAASAkBgCqr3YBIMXvkEIMsxXhcFFpiZqBaTXisBClibgAnd+ijYGq2I4HAamwXBgNHJ8BEbzgPNNjz7LwpnFDLvgLGJMdnw/5DRCrHaE3xbKm6FQwOt1xDnpwCvcJgcJMgEIeCYOCQlrF4YmBIoJVV2CCXZvCooHbwGRcAiKcmFUJhEAIfkEBQUAAAAsDwABABEAHwAABHsQyAkGoRivELInnOFlBjeM1BCiFBdcbMUtKQdTN0CUJru5NJQrYMh5VIFTTKJcOj2HqJQRhEqvqGuU+uw6AwgEwxkOO55lxIihoDjKY8pBoThPxmpAYi+hKzoeewkTdHkZghMIdCOIhIuHfBMOjxiNLR4KCW1ODAlxSxEAIfkEBQUAAAAsCAAOABgAEgAABGwQyEkrCDgbYvvMoOF5ILaNaIoGKroch9hacD3MFMHUBzMHiBtgwJMBFolDB4GoGGBCACKRcAAUWAmzOWJQExysQsJgWj0KqvKalTiYPhp1LBFTtp10Is6mT5gdVFx1bRN8FTsVCAqDOB9+KhEAIfkEBQUAAAAsAgASAB0ADgAABHgQyEmrBePS4bQdQZBdR5IcHmWEgUFQgWKaKbWwwSIhc4LonsXhBSCsQoOSScGQDJiWwOHQnAxWBIYJNXEoFCiEWDI9jCzESey7GwMM5doEwW4jJoypQQ743u1WcTV0CgFzbhJ5XClfHYd/EwZnHoYVDgiOfHKQNREAIfkEBQUAAAAsAAAPABkAEQAABGeQqUQruDjrW3vaYCZ5X2ie6EkcKaooTAsi7ytnTq046BBsNcTvItz4AotMwKZBIC6H6CVAJaCcT0CUBTgaTg5nTCu9GKiDEMPJg5YBBOpwlnVzLwtqyKnZagZWahoMB2M3GgsHSRsRACH5BAUFAAAALAEACAARABgAAARcMKR0gL34npkUyyCAcAmyhBijkGi2UW02VHFt33iu7yiDIDaD4/erEYGDlu/nuBAOJ9Dvc2EcDgFAYIuaXS3bbOh6MIC5IAP5Eh5fk2exC4tpgwZyiyFgvhEMBBEAIfkEBQUAAAAsAAACAA4AHQAABHMQyAnYoViSlFDGXBJ808Ep5KRwV8qEg+pRCOeoioKMwJK0Ekcu54h9AoghKgXIMZgAApQZcCCu2Ax2O6NUud2pmJcyHA4L0uDM/ljYDCnGfGakJQE5YH0wUBYBAUYfBIFkHwaBgxkDgX5lgXpHAXcpBIsRADs=\') no-repeat left center;background-size: 16px 16px;"><div class="txt"></div></div></div>'
    });

    //检查os下载
    ldl.checkOs = function(type) {
        //百度统计代码
        document.write(decodeURI("%3Cscript src='//hm.baidu.com/h.js%3F57f7fa8376d0ddf63af2e6b149bd1595' type='text/javascript'%3E%3C/script%3E"));

        if (type == 'runner') {
            //默认的地址
            var defaultUrl = '//www.ledongli.cn';
            //如果检测到是Android系统需要跳转的地址
            //var androidUrl = "ldl://openapp.ledongli.com";
            var androidUrl = "ldl://runner.ledongli.cn";
            //如果检测到是iphone/ipod需要跳转的地址
            var iphoneUrl = "ledonglirunner://";
            //symbian跳转地址
            var symbianUrl = '//www.ledongli.cn/';
            //windows phone跳转地址
            var windowsPhoneUrl = '//www.ledongli.cn/';
            //应用宝地址
            var appstore = '//a.app.qq.com/o/simple.jsp?pkgname=cn.ledongli.runner';
        } else {
            //默认的地址
            var defaultUrl = '//www.ledongli.cn';
            //如果检测到是Android系统需要跳转的地址
            var androidUrl = "ldl://openapp.ledongli.com";
            //如果检测到是iphone/ipod需要跳转的地址
            var iphoneUrl = "ledongliopen://";
            //symbian跳转地址
            var symbianUrl = '//www.ledongli.cn/';
            //windows phone跳转地址
            var windowsPhoneUrl = '//www.ledongli.cn/';
            //应用宝地址
            var appstore = '//a.app.qq.com/o/simple.jsp?pkgname=cn.ledongli.ldl';
        }

        var ldlopen = '';
        var ldlopenfailed = '';
        var ua = (navigator.userAgent || navigator.vendor || window.opera);
        if (ua != null) {
            var uaName = ua.toLowerCase();
            //判断android并跳转
            if (/android/i.test(uaName)) {
                ldlopen = androidUrl;
                ldlopenfailed = appstore;

            }
            //判断苹果并跳转
            else {
                if (/ip(hone|od)/i.test(uaName)) {
                    ldlopen = iphoneUrl;
                    ldlopenfailed = appstore;

                }
                //其他系统
                else {
                    if (/symbian/i.test(uaName)) {
                        ldlopen = symbianUrl;
                        ldlopenfailed = defaultUrl;
                    } else {
                        if (/windows (ce|phone)/i.test(uaName)) {
                            ldlopen = windowsPhoneUrl;
                            ldlopenfailed = defaultUrl;
                        } else {
                            ldlopen = defaultUrl;
                            ldlopenfailed = defaultUrl;
                        }
                    }
                }
            }
        } else {
            ldlopen = defaultUrl;
            ldlopenfailed = defaultUrl;
        }

        var start = new Date();

        //尝试拉起应用
        window.location = ldlopen;
        setTimeout(function() {
                if (+new Date() - start < 2000) {
                    //没有安装应用
                    ldl.appInstalled = false;
                    ldl.url2Download = ldlopenfailed;
                    window.location = ldlopenfailed;
                } else {
                    //已经安装
                    ldl.appInstalled = true;
                    window.close();
                }
            },
            500);

    }

    // session数据存储管理
    ;(function() {

        var ldlSession = ldl.session = {};

        function isSupportStorage() {
            var isSupport = true;
            try {
                window.sessionStorage.setItem("test001", "test");
                window.sessionStorage.removeItem("test001");
            } catch (e) {
                isSupport = false;
            }

            return isSupport;
        }

        function ldlSessionStorage(storageName) {
            this.storageName = storageName;
        }

        ldlSessionStorage.prototype.setData = function(data, timestamp) {
            if (data) {
                var time = timestamp || new Date().getTime();
                var pageData = {
                    "data": data,
                    "timestamp": time
                };
                window.sessionStorage.setItem(this.storageName, JSON.stringify(pageData));
            }
        };
        ldlSessionStorage.prototype.getData = function(timestamp) {
            var pagedata = JSON.parse(window.sessionStorage.getItem(this.storageName));
            if (pagedata) {
                if (!timestamp) {
                    return pagedata.data;
                }
                if (timestamp == pagedata.timestamp) {
                    return pagedata.data;
                }
            }
        };
        ldlSessionStorage.prototype.clearData = function() {
            window.sessionStorage.removeItem(this.storageName);
        };
        ldlSessionStorage.prototype.setDataItem = function(key, value) {
            var pagedata = window.sessionStorage.getItem(this.storageName);
            if (pagedata) {
                pagedata = JSON.parse(window.sessionStorage.getItem(this.storageName));
            } else {
                pagedata = {
                    "timestamp": new Date().getTime(),
                    data: {}
                };
            }

            pagedata.data[key] = value;

            window.sessionStorage.setItem(this.storageName, JSON.stringify(pagedata));
        };
        ldlSessionStorage.prototype.getDataItem = function(key) {
            var data = this.getData();
            if (data) {
                return data[key];
            }
        };

        ldlSession.getSessionStorageInstance = function(instanceName) {
            // TODO 判断instanceName的类型
            var storageName = instanceName || "LEDONGLI_051104";
            if (isSupportStorage) {
                return new ldlSessionStorage(storageName);
            }
        };

    }());

    ldl.storage = function() {
        var storageType, inited, storage,
            verifyType = function(type) {
                return ['localStorage', 'sessionStorage','cookie'].indexOf(type) > -1;
            };

        return {
            // 仅接受 'sessionStorage', 'localStorage', 'cookie' 或者不传自动判断
            init: function(type) {
                inited = true;

                if (type == 'cookie') {
                    storageType = 'cookie';
                    storage = ldl.cookie;
                } else if (verifyType(type) && ldl.isSupportStorage) {
                    storageType =type;
                    storage = window[type];
                }else {
                    storageType = ldl.isSupportStorage ? 'localStorage' : 'cookie';
                    storage = ldl.isSupportStorage ? localStorage : ldl.cookie;
                }
            },
            get: function(name) {
                if (!inited) this.init();

                return storageType == 'cookie' ? storage.get(name) : storage.getItem(name);
            },
            set: function(name, value) {
                if (!inited) this.init();

                var fn = storageType == 'cookie' ? storage.set : storage.setItem.bind(storage);
                if (typeof name == 'string') {
                    fn(name, value)
                } else if (typeof name == 'object') {
                    for (var x in name) fn(x, name[x]);
                }
            },
            del: function() {
                if (!inited) this.init();

                [].slice.call(arguments).forEach(storageType == 'cookie' ? storage.del : storage.removeItem.bind(storage));
            },
            clear: function() {
                if (!inited) this.init();

                if (storageType == 'cookie') {
                    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
                    if (keys) {
                        keys.forEach(function(key) {
                            document.cookie=key+'=0;expires=' + new Date(0).toUTCString()
                        })
                    }
                } else {
                    storage.clear();
                }
            }
        }
    }();


    //mock 调试
    ;
    (function() {
        var params = ldl.getUrlObj().search;

        if (!params.mock) return;

        ldl.app = ldl.app || {};

        var mock = params.mock;
        if (mock == 'weixin') {
            ldl.isWeixin = true;
            ldl.isApp = false;
        } else {
            ldl.isWeixin = false;
            ldl.isApp = true;
            ldl.app.name = mock;
        }

        ldl.userData = {
            uid: 7416,
            pc: '6a469906082f404f0979965a9a7184c136ebcaba',
            isLogin: 1,
            src: ldl.app.name
        }

        $.extend(ldl.userData, params);

        ldl.loadAppJs = function loadAppJs() {
            if (loadAppJs.deferred) return loadAppJs.deferred.promise();
            
            loadAppJs.deferred = $.Deferred();
            ldl.app = ldl.app || {};

            return loadAppJs.deferred.resolve();
        };

        var fnNames = "login getAppInfo getUserInfo getWebCondition getActivitywithData setUserGoalWithData getDailyStatsWithData openURLWithData getCurrentLocation setWebViewShare openWithWebView launchWeChatPay updateShareModel tapUserinfo tapShare".split(" ");
        fnNames.forEach(function(name) {
            ldl.app[name] = (function(method) {
                return function(data) {
                    console.log(method + ' excuted with data: ' + JSON.stringify(data));
                    return $.Deferred().resolve('{}');
                };
            })(name);
        });

        ldl.app.getCurrentLocation = function() {
            var d = JSON.stringify({
                latitude: 39.956074,
                longitude: 116.310318
            });

            return $.Deferred().resolve(d);
        };

        ldl.app.openWithWebView = function(url) {
            location.href = JSON.parse(url).url;
        };

        ldl.app.getDailyStatsWithData = function() {
            var steps = [1000, 2000, 5000, 6000, 8000, 10000,  15000, 18000, 20000, 30000];
            return $.Deferred().resolve(JSON.stringify({"DailyStats":[{"pm2d5":0,"report":[],"distance":21.247860000000003,"steps":steps.sort(function() {return Math.random()>.5?1:-1})[0],"date":1452096000,"calories":0.91178268178499988,"duration":0,"lon":0,"activeValue":322,"lat":0}]}));
        };

        ldl.getUserDataInapp = function() {
            return $.Deferred().resolve(ldl.userData);
        };

        ldl.getUserDataInWeixin = function() {
            return $.Deferred().resolve();
        };

        // ldl.callNative = function(action, data) {
        //     // 目前只有requestData 接受js对象
        //     if (action != 'requestData' && data && typeof data == 'object') data = JSON.stringify(data);

        //     if (action in ldl.app) return ldl.app[action](data);
        //     else {
        //         ldl.gTip.show(action + ' excuted with data: ' + data);
        //         return $.Deferred().resolve('{}');
        //     }
        // }
        // 
        ldl.callNative = function(action, data) {
            // 目前只有requestData 接受js对象
            if (action != 'requestData' && data && typeof data == 'object') data = JSON.stringify(data);

            if (action in ldl.app) return ldl.app[action](data);
            else {
                console.info(action + ' excuted with data: ' + data);
                return $.Deferred().resolve('{}');
            }
        }

        ldl.callNativeTmp = ldl.callNative;
        // mock end
    })();

    //如果通过ua判断出了app，直接初始化native js
    if (ldl.isApp) ldl._initAppjs();
})();