$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo != null) {
            window.location.href = "index.html";//已经登入，返回主页
        }
    });
});
module LOGIN {
    export function fgLogin() {//5玩账号登入，支持手机账号双登入
        var para = new GAMECENTER.GSUSERLOGINREQ();
        para.loginid = $("#account").val();
        para.pwd = MD5UTIL.hex_md5($("#account_password").val());
        if (!para.loginid) {
            alert("请输入5玩账号/已绑定手机号");
            $("#account").focus();
            return;
        }
        if (!para.pwd) {
            alert("请输入密码");
            $("#account_password").focus();
            return;
        }
        GAMECENTER.gsUserLogin(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: GAMECENTER.GSUSERLOGINRESP = resp.data;
            GAMECENTER.userinfo = dat.userinfo;
            GAMECENTER.SaveUserInfo();
            alert("登入成功,点击确定返回首页");
            window.location.href = "index.html";
        });
    }
}