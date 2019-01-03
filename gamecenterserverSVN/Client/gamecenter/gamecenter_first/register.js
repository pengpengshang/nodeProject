///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    gcregister.LoadData();
});
var gcregister;
(function (gcregister) {
    var para;
    var key = null;
    function LoadData() {
        para = utils.getCookie("GSUSERREGREQ");
        if (!para)
            para = new GAMECENTER.GSUSERREGREQ();
    }
    gcregister.LoadData = LoadData;
    function onReg() {
        para.nickname = $("#nickname").val();
        para.phone = $("#phone").val();
        para.code = $("#code").val();
        para.key = key;
        if (!para.nickname) {
            alert("请输入昵称");
            $("#nickname").focus();
            return;
        }
        if (!para.phone) {
            alert("请输入手机号");
            $("#phone").focus();
            return;
        }
        utils.setCookie("GSUSERREGREQ", para);
        window.location.href = "register2.shtml";
    }
    gcregister.onReg = onReg;
    function onGetCode() {
        var pa = new GAMECENTER.GSUSERLOGINSENDCODEREQ();
        pa.phone = $("#phone").val();
        pa.isreg = true;
        if (!pa.phone) {
            alert("请输入手机号");
            $("#phone").focus();
            return;
        }
        GAMECENTER.gsUserLoginSendCode(pa, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            key = dat.key;
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
    gcregister.onGetCode = onGetCode;
})(gcregister || (gcregister = {}));
//# sourceMappingURL=register.js.map