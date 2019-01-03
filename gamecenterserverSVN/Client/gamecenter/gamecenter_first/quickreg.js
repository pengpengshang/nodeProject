///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    gcquickreg.onRandNick();
});
var gcquickreg;
(function (gcquickreg) {
    function onRandNick() {
        GAMECENTER.gsUserRandNick({}, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $("#nickname").val(resp.data.nickname);
        });
    }
    gcquickreg.onRandNick = onRandNick;
    function onReg() {
        var para = new GAMECENTER.GSUSERREGREQ();
        para.nickname = $("#nickname").val();
        if (!para.nickname) {
            alert("请输入昵称！");
            $("#nickname").focus();
            return;
        }
        GAMECENTER.gsUserReg(para, function (resp) {
            if (resp.errno != 0) {
                $("#nickexist").show();
                return;
            }
            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            parent.window.postMessage({
                cmd: "login"
            }, "*");
        });
    }
    gcquickreg.onReg = onReg;
    function onLogin() {
        parent.window.location.href = "login.shtml";
    }
    gcquickreg.onLogin = onLogin;
})(gcquickreg || (gcquickreg = {}));
//# sourceMappingURL=quickreg.js.map