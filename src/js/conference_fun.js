$(function() {
    var $modelItem = $('.modelItem').find('section');
    var $meetingList = $('.meetingList');
    var $psdInput = $('.psdInput');
    var $psdSwitch = $('.psdSwitch');
    var $psdSwitchBtn = $psdSwitch.find('.psdSwitchBtn');

    $modelItem.each(function() {
        var $this = $(this);

        $this.click(function() { //模型选择
            // console.log($this.data('name'));
            
            if($this.hasClass('selected')) {
                $this.removeClass('selected');
            }
            else {
                $this.addClass('selected').siblings().removeClass('selected');
            }

            var content = $this.data('name') + $this.data('mid');

            $meetingList.append('<li>' + content + '</li');
        })
    })

    /****会议密码*****/

    var psdInputHtml = $psdInput.detach().show();

    $psdSwitchBtn.on('click', function() {
        var $this = $(this);

        if($this.hasClass('on')){
            //不要密码
            $this.removeClass('on');
            $psdInput.detach().show();
        }else{
            //要密码
            $this.addClass('on');
            $psdSwitch.after(psdInputHtml);
        }
    })

    /****提交创建*****/
    var $submit = $('.submit');
    var form = new ldl.Formfuc($('#createMeeting'));

    form.onSubmit = submit;

    function submit() { //验表成功
        console.log('c');
    }
    

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
                    var $modelItem = $('.modelItem').find('section');
                    $modelItem.each(function() {
                        $(this).remove();

                    });

                    var i = 1;

                    $.each(list, function() {

                        $('.modelItem').append(makeTag('section', { 'data-name': this.name, 'data-mid': this.modelId, 'data-img': this.img }, this.name));

                        console.log(makeTag('section', { 'data-name': this.name, 'data-mid': this.modelId, 'data-img': this.img }, this.name));
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
            console.log(obj[key]);
            html += key + "=";
            html += "\"" + obj[key] + "\" ";

        }
        html += '>' + value + '</' + tag + ">";
        return html;
    }
})
