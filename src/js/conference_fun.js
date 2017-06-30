;(function() {

    // $('.closePop').on('click', function() {
    //     console.log("c");
    //     $('#psdPop').hide();
    // })

    // var $meetingPsdInput = $('.selectMeetingPsd').find('input');

    // $('#joinMeetingBtn').on('click', function(){
    //     var _psd = $meetingPsdInput.val() || '';

    //     if(!_psd || _psd.length!=6 ) {
    //         ldl.gTip.show('请输入6位密码');
    //     }
    //     else if(_psd != psd) {
    //         ldl.gTip.show('密码错误');
    //     }
    //     else {
    //         ldl.gModalLoading.show('密码正确, 即将跳转', function() {
    //             console.log('psd input success');
    //         })
    //     }
    // })
    ///

    var ecp = window.ecp = {
        version: '0.1'
    }

    var $meetingList      = $('.meetingList');  //会议列表

    var $creatMeetingForm = $('#createMeeting'); //新建会议相关
    var $meetingName      = $creatMeetingForm.find('input[name=meetingName]'); 
    var $psdSwitch        = $creatMeetingForm.find('.psdSwitch'); 
    var $psdSwitchBtn     = $psdSwitch.find('.psdSwitchBtn');
    var $psdInput   = $creatMeetingForm.find('.psdInput');
    
    var $modelItem        = $creatMeetingForm.find('.modelItem');
    var $modelSection     = $modelItem.find('section');
    var $submit           = $creatMeetingForm.find('.submit');

    /****模型选择*****/
    $modelSection.each(function() {
        var $this = $(this);

        $this.click(function() { 
            
            if($this.hasClass('selected')) { //取消选中
                $this.removeClass('selected')
                        .parent('.inputArea').val('');
            }
            else { //选中一个
                $this.addClass('selected').siblings().removeClass('selected')
                        .parent('.inputArea').val(1);
            }

            // var content = $this.data('name') + $this.data('mid');
            // $meetingList.append('<li data-modelname=' + $this.data('name') + ' data-modelid=' + $this.data('name') + '>' + content + '</li');
        })
    })

    /****会议密码*****/
    var psdInputHtml = $psdInput.remove().show();

    $psdSwitchBtn.on('click', function() {

        var $this = $(this);

        if($this.hasClass('on')){//不要密码
            $this.removeClass('on');
            $psdInput.remove().show();
        }
        else{//要密码   
            $this.addClass('on');
            $psdSwitch.after(psdInputHtml);
        }
    })

    /****提交创建*****/
    
    var form = new ldl.Formfuc($creatMeetingForm);
        
    form.onSubmit = submit;

    function submit() { //验表成功
        
        var $meetingPsd = $('input[name=meetingPsd]');

        var $modelInfo  = $modelItem.find('.selected');
        var modelName   = $modelInfo.data('name'),
            modelId     = $modelInfo.data('mid');
        var meetingName = $meetingName.val();
        var meetingPsd  = $meetingPsd.val() || '';

        ldl.gTip.show('创建成功',3000);

        $meetingList.append('<li onclick="ecp.setItem($(this))" data-modelname=' + modelName + ' data-modelid=' + modelId + ' data-psd=' + meetingPsd + '>' + meetingName + '</li');
    }
    
    /****选择会议*****/

    ecp.setItem = function($this) {

        var meetingName = $this.html() || '',
            psd         = $this.data('psd') || '',
            modelName   = $this.data('modelname') || '',
            modelId     = $this.data('modelid') || '';

        if(!psd) { //没有密码
            ldl.gModalLoading.show("该会议不需要密码，即将跳转", 3000, function(){
                // location.href = 'https://www.baidu.com';
            });
        }
        else { //需要密码
            // alert("yao mima");
            $('#psdPop').find('.selectMeetingName p').html(meetingName);
            $('#psdPop').show();

            $('.closePop').on('click', function() {
                console.log("c");
                $('#psdPop').hide();
            })

            var $meetingPsdInput = $('.selectMeetingPsd').find('input');

            $('#joinMeetingBtn').on('click', function(){
                var _psd = $meetingPsdInput.val() || '';

                if(!_psd || _psd.length!=6 ) {
                    ldl.gTip.show('请输入6位密码');
                }
                else if(_psd != psd) {
                    ldl.gTip.show('密码错误');
                }
                else {
                    $('#psdPop').hide();
                    ldl.gModalLoading.show('密码正确, 即将跳转', function() {
                        console.log('psd input success');
                    })
                }
            })

        }
    }

    

    ecp.setMeetingItemClick = function() {

        var $meetingItem = $meetingList.find('li');

        if($meetingItem.length != 0) {
            $meetingList.find('li').each(function() {

                var $this = $(this);

                $this.on('click', function() {
                    ecp.setItem($this);
                })
            })
        }
    }

    ecp.setMeetingItemClick();
    
    

    // pageReady();

    // var wsurl = "ws://127.0.0.1:9999";
    var wsurl = "ws://www.dongqin.xin:9999/";

    function pageReady() {

        var ws = new WebSocket(wsurl);

        ws.onopen = function() {

            ws.onmessage = function(evt) {

                var msg = JSON.parse(evt.data);

                if (msg.type == 'modelList') {
                    var list = msg.model;
                    var $modelSection = $modelItem.find('section');
                    $modelSection.each(function() {
                        $(this).remove();

                    });

                    var i = 1;

                    $.each(list, function() {

                        $modelItem.append(makeTag('section', { 'data-name': this.name, 'data-mid': this.modelId, 'data-img': this.img }, this.name));

                    });

                } else if (msg.type == 'conferenceList') {
                    //update conferenceList

                }
            };
            setInterval(function() {
                ws.send(JSON.stringify({ type: "modelList" }));

            }, 5000);
            setInterval(function() {
                ws.send(JSON.stringify({ type: "conferenceList" }));

            }, 5000);
        };
    }

    function makeTag(tag, obj, value) {
        var html = '<' + tag + " ";
        for (var key in obj) {
            html += key + "=";
            html += "\"" + obj[key] + "\" ";

        }
        html += '>' + value + '</' + tag + ">";
        return html;
    }
})();

    
