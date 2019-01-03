$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo != null) {
            LOGININDEX.dialogBox("已经登入（" + userinfo.sdkloginid + "）", function () {
                window.location.href = "index.html"; //已经登入，返回主页
            });
        }
        LOGININDEX.onRandNick();
    });
});
var LOGININDEX;
(function (LOGININDEX) {
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
            GAMECENTER.gsUserLogin_old(para, function (resp) {
                if (resp.errno != 0) {
                    dialogBox(resp.message, null);
                    return;
                }
                var dat = resp.data;
                GAMECENTER.userinfo = dat.userinfo;
                GAMECENTER.SaveUserInfo();
                dialogBox("登入成功", function () {
                    window.location.href = "index.html";
                });
            });
        });
    }
    LOGININDEX.fgLogin = fgLogin;
    function onRandNick() {
        GAMECENTER.gsUserRandNick({}, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $("#nickname").val(resp.data.nickname);
        });
    }
    LOGININDEX.onRandNick = onRandNick;
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
                dialogBox(resp.message, null);
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
                    phoneText.attr("onclick", "LOGININDEX.sendCode(" + flags + ");");
                    clearInterval(timer);
                }
            }, 1000);
        });
    }
    LOGININDEX.sendCode = sendCode;
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
                    dialogBox(resp.message, null);
                    return;
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                $("#wUser").val(null);
                $("#wPwd").val(null);
                $("#phoneNum").val(null);
                $("#phoneCode").val(null);
                dialogBox("注册成功", function () {
                    window.location.href = "index.html";
                });
            });
        });
    }
    LOGININDEX.fgReg = fgReg;
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
                    dialogBox(resp.message, null);
                    return;
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();
                dialogBox("登入成功", function () {
                    window.location.href = "index.html";
                });
            });
        });
    }
    LOGININDEX.fgPhonelogin = fgPhonelogin;
    function fgForgetPwd(cb) {
        var loginid = $("#wUser").val();
        mobileCheck({
            ygUser: loginid
        }, function () {
            var para = new GAMECENTER.USERCHECKBINDPHONEREQ();
            para.loginid = loginid;
            GAMECENTER.gsUserCheckBindPhone(para, function (resp) {
                if (resp.errno != 0) {
                    dialogBox(resp.message);
                    return;
                }
                cb(loginid);
            });
        });
    }
    LOGININDEX.fgForgetPwd = fgForgetPwd;
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
                    dialogBox(resp.message);
                    return;
                }
                dialogBox("修改成功", function () {
                    loadanimate(accountLogin());
                    $("#Whead").text("账号登入");
                });
            });
        });
    }
    LOGININDEX.fgModifyPwd = fgModifyPwd;
    function getCode() {
        var loginid = $("#loginid").val();
        var phone_code = $("#phoneCode");
        mobileCheck({}, function () {
            var para = new GAMECENTER.USERFINDPWDSENDCODEREQ();
            para.loginid = loginid;
            GAMECENTER.gsUserFindPwdSendCode(para, function (resp) {
                if (resp.errno != 0) {
                    dialogBox(resp.message);
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
                        phoneText.attr("onclick", "LOGININDEX.getCode();");
                        clearInterval(timer);
                    }
                }, 1000);
            });
        });
    }
    LOGININDEX.getCode = getCode;
    function dialogBox(txt, callback) {
        var html = '<div id="dialogBox" class="dialog_box">';
        html += '<div class="dialog">';
        html += '<div class="dialog_tip">提示信息</div>';
        html += '<div class="dialog_mess">' + txt + "</div>";
        html += '<div class="dialog_qd">';
        html += '<a href="javascript:;">确定</a>';
        html += '</div></div></div>';
        $("body").append(html);
        $(".dialog_qd a").click(function () {
            $("#dialogBox").remove();
            if (callback) {
                callback();
            }
        });
    }
    LOGININDEX.dialogBox = dialogBox;
    function mobileCheck(args, callback) {
        if (!args.ygUser && args.ygUser !== undefined) {
            dialogBox("请输入账号！");
            return;
        }
        else {
            if (!/^[A-Za-z0-9_]*$/.test(args.ygUser)) {
                dialogBox("账号由字母、数字、下划线组成！");
                return;
            }
            if (!args.phone && args.phone !== undefined) {
                dialogBox("请输入手机号！");
                return;
            }
            if (!/^1[3|4|5|7|8]\d{9}$/.test(args.phone) && args.phone !== undefined) {
                dialogBox("请填入有效的手机号码！");
                return;
            }
        }
        if (args.confirmPwd) {
            if (args.confirmPwd != args.pwd) {
                dialogBox("密码不一致！");
                return;
            }
        }
        if (!args.confirmPwd && args.confirmPwd !== undefined) {
            dialogBox("请输入确认密码！");
            return;
        }
        if (!args.smsCode && args.smsCode !== undefined) {
            dialogBox("请输入短信验证码！");
            return;
        }
        if (!args.pwd && args.pwd !== undefined) {
            dialogBox("请输入密码！");
            return;
        }
        if (args.pwd && args.pwd.length < 6) {
            dialogBox("密码长度不能少于6位！");
            return;
        }
        if (!args.wpwd && args.wpwd !== undefined) {
            dialogBox("请输入密码！");
            return;
        }
        callback();
    }
    LOGININDEX.mobileCheck = mobileCheck;
})(LOGININDEX || (LOGININDEX = {}));
//# sourceMappingURL=loginIndex.js.map