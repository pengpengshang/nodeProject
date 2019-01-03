///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gceditphone.LoadData();
    });
});
var gceditphone;
(function (gceditphone) {
    function LoadData() {
        if (!GAMECENTER.userinfo) {
            window.location.href = "login.shtml";
            return;
        }
    }
    gceditphone.LoadData = LoadData;
    function CheckPhone(phone) {
        if (phone.length != 11) {
            return false;
        }
        var r, re;
        re = /\d*/i; //\d表示数字,*表示匹配多个数字
        r = phone.match(re);
        return (r == phone) ? true : false;
    }
    var key;
    function onSendCode() {
        var phone = $("#phone").val();
        if (!CheckPhone(phone)) {
            alert("请输入正确的手机号！");
            $("#phone").focus();
            return;
        }
        GAMECENTER.gsUserSendPhoneCode({ mysession: GAMECENTER.userinfo.session, phone: phone }, function (resp) {
            if (resp.data) {
                var dat = resp.data;
                key = dat.key;
            }
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var btnsend = document.getElementById("btnsend");
            btnsend.style.backgroundColor = "gray";
            btnsend.value = "60s后重新发送";
            btnsend.disabled = true;
            $("#code").focus();
            var second = 60;
            var timer = setInterval(function () {
                second--;
                if (second > 0)
                    btnsend.value = second + "s后重新发送";
                else {
                    btnsend.style.backgroundColor = "#4ecc6e";
                    btnsend.value = "获取验证码";
                    btnsend.disabled = false;
                    clearInterval(timer);
                }
            }, 1000);
        });
    }
    gceditphone.onSendCode = onSendCode;
    function onOK() {
        var phone = $("#phone").val();
        if (!CheckPhone(phone)) {
            alert("请输入正确的手机号！");
            $("#phone").focus();
        }
        var code = $("#code").val();
        var para = new GAMECENTER.GSUSERSETPHONEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.phone = phone;
        para.code = code;
        para.key = key;
        GAMECENTER.gsUserSetPhone(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("修改成功！");
            history.back();
        });
    }
    gceditphone.onOK = onOK;
})(gceditphone || (gceditphone = {}));
//# sourceMappingURL=editphone.js.map