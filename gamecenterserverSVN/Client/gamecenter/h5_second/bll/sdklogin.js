$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    SDKLOGIN.sdklogin();
});
var SDKLOGIN;
(function (SDKLOGIN) {
    function sdklogin() {
        var _this = this;
        var state = getQueryString("state");
        var code = getQueryString("code");
        if (state == "WX") {
            var para = new GAMECENTER.USERLOGINWEIXINREQ();
            //para.code = "011Z912P1jb5uX0sxtZO1MC32P1Z912s";
            para.code = code;
            para.state = state;
            para.loginid = getLoginIdRandom("zfkj");
            para.pwd = "";
            GAMECENTER.gsUserLoginWeixin(para, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    _this.ShowLogin();
                    return;
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                window.location.href = "index.html";
            });
        }
        else if (state == "QQ") {
            var para = new GAMECENTER.USERLOGINQQREQ();
            //para.code = "011Z912P1jb5uX0sxtZO1MC32P1Z912s";
            para.code = code;
            para.state = state;
            para.loginid = getLoginIdRandom("sdkauth");
            para.pwd = "";
            GAMECENTER.gsUserLoginQQ(para, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    _this.ShowLogin();
                    return;
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                window.location.href = "index.html";
            });
        }
    }
    SDKLOGIN.sdklogin = sdklogin;
    function getLoginIdRandom(para) {
        var loginId = Math.floor(Math.random() * 100000).toFixed(0);
        return para + loginId;
    }
})(SDKLOGIN || (SDKLOGIN = {}));
//# sourceMappingURL=sdklogin.js.map