$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    SDKLOGIN_NEW.sdklogin();
})
module SDKLOGIN_NEW {
    export function sdklogin() {
        var state = getQueryString("state");
        var code = getQueryString("code");
        if (state == "WX")//微信授权登录
        {
            var para = new GAMECENTER.USERLOGINWEIXINREQ();
            //para.code = "011Z912P1jb5uX0sxtZO1MC32P1Z912s";
            para.code = code;
            para.state = state;
            para.loginid = getLoginIdRandom("zfkj");
            para.pwd = "";
            GAMECENTER.gsUserLoginWeixin(para, resp => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                window.location.href = "index.html";
            });
        } else if (state == "QQ") {
            var para = new GAMECENTER.USERLOGINQQREQ();
            //para.code = "011Z912P1jb5uX0sxtZO1MC32P1Z912s";
            para.code = code;
            para.state = state;
            para.loginid = getLoginIdRandom("sdkauth");
            para.pwd = "";
            GAMECENTER.gsUserLoginQQ(para, resp => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                window.location.href = "index.html";
            });
        }
    }

    function getLoginIdRandom(para) {
        var loginId = Math.floor(Math.random() * 100000).toFixed(0);
        return para + loginId;
    }
}