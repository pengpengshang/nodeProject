///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    gcregister2.LoadData();
});
var gcregister2;
(function (gcregister2) {
    var para;
    function LoadData() {
        para = utils.getCookie("GSUSERREGREQ");
        if (!para)
            history.back();
        utils.setCookie("GSUSERREGREQ", null);
    }
    gcregister2.LoadData = LoadData;
    function onReg() {
        para.pwd = $("#pwd").val();
        if (!para.pwd) {
            alert("请输入密码！");
            $("#pwd").focus();
            return;
        }
        var pwd2 = $("#pwd2").val();
        if (para.pwd != pwd2) {
            alert("两次输入密码不一致！");
            $("#pwd2").focus();
            return;
        }
        para.pwd = MD5UTIL.hex_md5(para.pwd);
        GAMECENTER.gsUserReg(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            history.go(-2);
        });
    }
    gcregister2.onReg = onReg;
})(gcregister2 || (gcregister2 = {}));
//# sourceMappingURL=register2.js.map