///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
});
var gclogin;
(function (gclogin) {
    function onLogin() {
        var para = new GAMECENTER.GSUSERLOGINREQ();
        para.loginid = $("#phone").val();
        para.pwd = MD5UTIL.hex_md5($("#pwd").val());
        if (!para.loginid) {
            alert("请输入手机号");
            $("#phone").focus();
            return;
        }
        if (!para.pwd) {
            alert("请输入密码");
            $("#pwd").focus();
            return;
        }
        GAMECENTER.gsUserLogin(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            GAMECENTER.userinfo = dat.userinfo;
            GAMECENTER.SaveUserInfo();
            history.back();
        });
    }
    gclogin.onLogin = onLogin;
})(gclogin || (gclogin = {}));
//# sourceMappingURL=login.js.map