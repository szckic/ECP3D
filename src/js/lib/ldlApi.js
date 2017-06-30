'use strict';
(function() {
    var ldl = window.ldl = {
        version: '1.2'
    };

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
                        document.body.removeChild(wxScript);
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
            WebViewJavascriptBridge.callHandler(action, data, def.resolve);
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
    // todo 废弃
    ldl.loadAppJs = function loadAppJs() {
        if (loadAppJs.deferred) return loadAppJs.deferred.promise();
        if (!ldl.isApp) return $.Deferred().reject('not in app');

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
        } else if (ldl.isAndroid) {
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

    ldl.getUserId = function() {
        if (!ldl.isApp) return $.Deferred().reject('不在app里');

        return  ldl.callNativeTmp('getUserId').then(function(res){
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

    ldl.getUserDataInapp = function() {
        if (!ldl.isApp) return $.Deferred().reject('不在app里');

        return  ldl.callNativeTmp('getUserInfo').then(function(res){
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
        ldl.userData.isLogin = +params.isLogin;

        ldl.loadAppJs = function loadAppJs() {
            if (loadAppJs.deferred) return loadAppJs.deferred.promise();
            
            loadAppJs.deferred = $.Deferred();
            ldl.app = ldl.app || {};

            return loadAppJs.deferred.resolve();
        };

        var fnNames = "login getUserId getAppInfo getUserInfo getWebCondition getActivitywithData setUserGoalWithData getDailyStatsWithData openURLWithData getCurrentLocation setWebViewShare openWithWebView launchWeChatPay updateShareModel tapUserinfo tapShare".split(" ");
        fnNames.forEach(function(name) {
            ldl.app[name] = (function(method) {
                return function(data) {
                    console.info(method + ' excuted with data: ' + JSON.stringify(data));
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