$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo != null && userinfo != undefined) {
            utils.dialogBox("已经登入（" + userinfo.sdkloginid + "）", function () {
                /*if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    if (!!utils.getExpiresCookies("loginFlags")) {
                        window.location.href = "../../gamepage.html#422";
                        //window.location.href = "http://www.baidu.com/";
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    window.location.href = "index.html";
                }*/
                window.location.href = "index.html";
            });
        }
        utils.setExpiresCookies("loginFlags", "1");
        LOGININDEX_NEW.onRandNick();
    });
});
var LOGININDEX_NEW;
(function (LOGININDEX_NEW) {
    function fgLogin() {
        var loginid = $("#wUser").val();
        var pwd = $("#wPwd").val();
        mobileCheck({
            ygUser: loginid,
            wpwd: pwd
        }, function () {
            var para = new GAMECENTER.GSUSERLOGINREQ();
            para.loginid = loginid;
            para.pwd = MD5UTIL.hex_md5(pwd);
            GAMECENTER.gsUserLogin(para, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message, null);
                    return;
                }
                var dat = resp.data;
                if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    window["android"].fg(JSON.stringify(resp.data.userinfo));
                }
                GAMECENTER.userinfo = dat.userinfo;
                GAMECENTER.SaveUserInfo();
                // utils.dialogBox("登入成功", () => {
                window.location.href = "index.html";
                // });
            });
        });
    }
    LOGININDEX_NEW.fgLogin = fgLogin;
    function fgLogin_old() {
        var loginid = $("#wUser").val();
        var pwd = $("#wPwd").val();
        mobileCheck({
            ygUser: loginid,
            wpwd: pwd
        }, function () {
            var para = new GAMECENTER.GSUSERLOGINREQ();
            para.loginid = loginid;
            para.pwd = MD5UTIL.hex_md5(pwd);
            GAMECENTER.gsUserLogin_old(para, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message, null);
                    return;
                }
                var dat = resp.data;
                if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    window["android"].fg(JSON.stringify(resp.data.userinfo));
                    GAMECENTER.userinfo = dat.userinfo;
                    GAMECENTER.SaveUserInfo();
                    window.location.href = "index.html";
                }
                else {
                    GAMECENTER.userinfo = dat.userinfo;
                    GAMECENTER.SaveUserInfo();
                    window.location.href = "index.html";
                }
                // utils.dialogBox("登入成功", () => {
                //window.location.href = "index.html";
                // });
            });
        });
    }
    LOGININDEX_NEW.fgLogin_old = fgLogin_old;
    function onRandNick() {
        GAMECENTER.gsUserRandNick({}, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            $("#nickname").val(resp.data.nickname);
        });
    }
    LOGININDEX_NEW.onRandNick = onRandNick;
    var key;
    function sendCode(flags) {
        var phone_number = $("#phoneNum");
        var phone_code = $("#phoneCode");
        GAMECENTER.gsUserLoginSendCode({ phone: phone_number.val(), isreg: flags }, function (resp) {
            if (resp.data) {
                var dat = resp.data;
                key = dat.key;
            }
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, null);
                return;
            }
            var phoneText = $("#sendCode");
            phoneText.text("60s后重新发送");
            phoneText.removeAttr("onclick");
            phone_code.focus();
            var second = 60;
            var timer = setInterval(function () {
                second--;
                if (second > 0)
                    phoneText.text(second + "s后重新发送");
                else {
                    phoneText.text("获取验证码");
                    phoneText.attr("onclick", "LOGININDEX_NEW.sendCode(" + flags + ");");
                    clearInterval(timer);
                }
            }, 1000);
        });
    }
    LOGININDEX_NEW.sendCode = sendCode;
    function fgReg() {
        var loginId = $("#wUser").val();
        var pwd = $("#wPwd").val();
        var phoneNum = $("#phoneNum").val();
        var phone_codes = $("#phoneCode").val();
        mobileCheck({
            ygUser: loginId,
            pwd: pwd
        }, function () {
            var para = new GAMECENTER.GSUSERREGREQ();
            if (!phoneNum) {
                phoneNum = null;
            }
            else {
                para.phone = phoneNum;
                para.code = phone_codes;
                para.key = key;
            }
            para.loginid = loginId;
            para.nickname = $("#nickname").val();
            para.pwd = MD5UTIL.hex_md5(pwd);
            GAMECENTER.gsUserReg(para, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message, null);
                    return;
                }
                if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    window["android"].fg(JSON.stringify(resp.data.userinfo));
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                $("#wUser").val(null);
                $("#wPwd").val(null);
                $("#phoneNum").val(null);
                $("#phoneCode").val(null);
                utils.dialogBox("注册成功", function () {
                    window.location.href = "index.html";
                });
            });
        });
    }
    LOGININDEX_NEW.fgReg = fgReg;
    function fgPhonelogin() {
        var phone_number = $("#phoneNum").val();
        var phone_code = $("#phoneCode").val();
        mobileCheck({
            phone: phone_number,
            smsCode: phone_code
        }, function () {
            var para = new GAMECENTER.GSUSERLOGINREQ();
            para.phone = phone_number;
            para.code = phone_code;
            GAMECENTER.gsUserLogin(para, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message, null);
                    return;
                }
                if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    window["android"].fg(JSON.stringify(resp.data.userinfo));
                    GAMECENTER.userinfo = resp.data.userinfo;
                    GAMECENTER.SaveUserInfo();
                    window.location.href = "index.html";
                }
                else {
                    GAMECENTER.userinfo = resp.data.userinfo;
                    GAMECENTER.SaveUserInfo();
                    window.location.href = "index.html";
                }
                // utils.dialogBox("登入成功", () => {
                //window.location.href = "index.html";
                // });
            });
        });
    }
    LOGININDEX_NEW.fgPhonelogin = fgPhonelogin;
    function QQLogin() {
        //console.log(window["android"].qq());
        var qqinfo = JSON.parse(window["android"].qq());
        var para = new GAMECENTER.GSUSERQQLOGINREQ();
        var pwd = (Math.random() * 100000).toFixed(0);
        para.pwd = MD5UTIL.hex_md5(pwd);
        para.nickname = qqinfo.nickname;
        para.qqid = qqinfo.openid;
        para.headico = qqinfo.figureurl_2;
        GAMECENTER.gsUserLogin_qq(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, null);
                return;
            }
            /*if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                //window["android"].fg(JSON.stringify(resp.data.userinfo));
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                if (!!utils.getExpiresCookies("loginFlags")) {
                    window.location.href = "../../gamepage.html#422";
                } else {
                    window.location.href = "index.html";
                }
            } else {
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                window.location.href = "index.html";
            }*/
            // utils.dialogBox("登入成功", () => {
            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            window.location.href = "index.html";
            // });
        });
    }
    LOGININDEX_NEW.QQLogin = QQLogin;
    function WXLogin() {
        //console.log(window["android"].wx());
        var wxinfo = JSON.parse(window["android"].wx());
        var para = new GAMECENTER.GSUSERWXLOGINREQ();
        var pwd = (Math.random() * 100000).toFixed(0);
        para.pwd = MD5UTIL.hex_md5(pwd);
        para.nickname = wxinfo.nickname;
        para.wxid = wxinfo.unionid;
        console.log(wxinfo.unionid);
        console.log(para.wxid);
        para.headico = wxinfo.headimgurl;
        GAMECENTER.gsUserLogin_wx(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, null);
                return;
            }
            /*if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                //window["android"].fg(JSON.stringify(resp.data.userinfo));
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                if (!!utils.getExpiresCookies("loginFlags")) {
                    window.location.href = "../../gamepage.html#422";
                } else {
                    window.location.href = "index.html";
                }
            } else {
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                window.location.href = "index.html";
            }*/
            // utils.dialogBox("登入成功", () => {
            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            window.location.href = "index.html";
            // });
        });
    }
    LOGININDEX_NEW.WXLogin = WXLogin;
    function fgForgetPwd(cb) {
        var loginid = $("#wUser").val();
        mobileCheck({
            ygUser: loginid
        }, function () {
            var para = new GAMECENTER.USERCHECKBINDPHONEREQ();
            para.loginid = loginid;
            GAMECENTER.gsUserCheckBindPhone(para, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                cb(loginid);
            });
        });
    }
    LOGININDEX_NEW.fgForgetPwd = fgForgetPwd;
    function fgModifyPwd() {
        var loginid = $("#loginid").val();
        var phone_code = $("#phoneCode").val();
        var pwd = $("#wPwd").val();
        mobileCheck({
            pwd: pwd,
            smsCode: phone_code
        }, function () {
            var para = new GAMECENTER.USERFINDPWDCHANGEPWDREQ();
            para.loginid = loginid;
            para.code = phone_code;
            para.pwd = MD5UTIL.hex_md5(pwd);
            GAMECENTER.gsUserFindPwdChangePwd(para, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                utils.dialogBox("修改成功", function () {
                    loadanimate(accountLogin());
                    $("#Whead").text("账号登入");
                });
            });
        });
    }
    LOGININDEX_NEW.fgModifyPwd = fgModifyPwd;
    function getCode() {
        var loginid = $("#loginid").val();
        var phone_code = $("#phoneCode");
        mobileCheck({}, function () {
            var para = new GAMECENTER.USERFINDPWDSENDCODEREQ();
            para.loginid = loginid;
            GAMECENTER.gsUserFindPwdSendCode(para, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                var phoneText = $("#sendCode");
                phoneText.text("60s后重新发送");
                phoneText.removeAttr("onclick");
                phone_code.focus();
                var second = 60;
                var timer = setInterval(function () {
                    second--;
                    if (second > 0)
                        phoneText.text(second + "s后重新发送");
                    else {
                        phoneText.text("获取验证码");
                        phoneText.attr("onclick", "LOGININDEX_NEW.getCode();");
                        clearInterval(timer);
                    }
                }, 1000);
            });
        });
    }
    LOGININDEX_NEW.getCode = getCode;
    function mobileCheck(args, callback) {
        if (!args.ygUser && args.ygUser !== undefined) {
            utils.dialogBox("请输入账号！");
            return;
        }
        else {
            if (!/^[A-Za-z0-9_]*$/.test(args.ygUser)) {
                utils.dialogBox("账号由字母、数字、下划线组成！");
                return;
            }
            if (!args.phone && args.phone !== undefined) {
                utils.dialogBox("请输入手机号！");
                return;
            }
            if (!/^1[3|4|5|7|8]\d{9}$/.test(args.phone) && args.phone !== undefined) {
                utils.dialogBox("请填入有效的手机号码！");
                return;
            }
        }
        if (args.confirmPwd) {
            if (args.confirmPwd != args.pwd) {
                utils.dialogBox("密码不一致！");
                return;
            }
        }
        if (!args.confirmPwd && args.confirmPwd !== undefined) {
            utils.dialogBox("请输入确认密码！");
            return;
        }
        if (!args.smsCode && args.smsCode !== undefined) {
            utils.dialogBox("请输入短信验证码！");
            return;
        }
        if (!args.pwd && args.pwd !== undefined) {
            utils.dialogBox("请输入密码！");
            return;
        }
        if (args.pwd && args.pwd.length < 6) {
            utils.dialogBox("密码长度不能少于6位！");
            return;
        }
        if (!args.wpwd && args.wpwd !== undefined) {
            utils.dialogBox("请输入密码！");
            return;
        }
        callback();
    }
    LOGININDEX_NEW.mobileCheck = mobileCheck;
})(LOGININDEX_NEW || (LOGININDEX_NEW = {}));
//# sourceMappingURL=loginIndex.js.map