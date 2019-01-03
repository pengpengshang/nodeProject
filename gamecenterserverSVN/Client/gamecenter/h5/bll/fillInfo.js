$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
        FILLINFO.LoadDefData(userinfo);
    });
});
var FILLINFO;
(function (FILLINFO) {
    var key;
    function LoadDefData(userinfo) {
        if (userinfo.phone != "" && userinfo.phone != null) {
            $("#phoneBind_num").text(userinfo.phone.substring(0, 3) + "****" + userinfo.phone.substring(8, 11));
        }
        else {
            if (userinfo.email != "" && userinfo.email != null) {
                $("#mailBind_num").text(userinfo.email.substring(0, 4) + "*****" + userinfo.email.substring(userinfo.email.indexOf('@'), userinfo.email.length));
            }
            else {
                $("#phoneBind_num").text(userinfo.phone.substring(0, 3) + "****" + userinfo.phone.substring(8, 11));
            }
        }
        $("#nickname").val(userinfo.nickname);
    }
    FILLINFO.LoadDefData = LoadDefData;
    function fgModifyPwd() {
        var loginid = GAMECENTER.userinfo.sdkloginid;
        var phone_code = $("#phoneCode").val();
        var pwd = $("#wPwd").val();
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
                loadresult(accountLogin());
                $("#titleName").text("账号登入");
            });
        });
    }
    FILLINFO.fgModifyPwd = fgModifyPwd;
    function getCode() {
        var loginid = GAMECENTER.userinfo.sdkloginid;
        var phone_code = $("#phoneCode");
        var para = new GAMECENTER.USERFINDPWDSENDCODEREQ();
        para.loginid = loginid;
        GAMECENTER.gsUserFindPwdSendCode(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, function () {
                    loadresult(modifyPhone());
                    $("#titleName").text("手机绑定");
                });
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
                    phoneText.attr("onclick", "FILLINFO.getCode();");
                    clearInterval(timer);
                }
            }, 1000);
        });
    }
    FILLINFO.getCode = getCode;
    function updateNickName() {
        var para = new GAMECENTER.GSUSERSETNICKNAMEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.nickname = $("#nickname").val();
        if (!para.nickname) {
            utils.dialogBox("请输入昵称！");
            return;
        }
        GAMECENTER.gsUserSetNickName(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            history.back();
        });
    }
    FILLINFO.updateNickName = updateNickName;
    function sendCode() {
        var phone_number = $("#phoneNum");
        var phone_code = $("#phoneCode");
        GAMECENTER.gsCheckPhone(phone_number.val(), function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            GAMECENTER.gsUserSendPhoneCode({ mysession: GAMECENTER.userinfo.session, phone: phone_number.val() }, function (resp) {
                if (resp.data) {
                    var dat = resp.data;
                    key = dat.key;
                }
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
                        phoneText.attr("onclick", "FILLINFO.sendCode();");
                        clearInterval(timer);
                    }
                }, 1000);
            });
        });
    }
    FILLINFO.sendCode = sendCode;
    function cognatePhone() {
        var phone_number = $("#phoneNum");
        var phone_code = $("#phoneCode");
        var code = phone_code.val();
        var para = new GAMECENTER.GSUSERSETPHONEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.phone = phone_number.val();
        para.code = code;
        para.key = key;
        GAMECENTER.gsUserSetPhone(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            utils.dialogBox("绑定成功", function () {
                window.location.href = "personInfo.html";
            });
        });
    }
    FILLINFO.cognatePhone = cognatePhone;
    function sendMailCode() {
        var mail_number = $("#mailNum");
        var mail_code = $("#mailCode");
        var para = new GAMECENTER.GSUSERSENDMAILCODEREQ();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.mail = mail_number.val();
        if (para.mail == "" || para.mail == null) {
            utils.dialogBox("请输入您的邮箱", function () {
                mail_number.focus();
            });
            return;
        }
        else {
            var reg = new RegExp('^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+');
            if (!reg.test(para.mail)) {
                utils.dialogBox("请输入合法的邮箱格式", function () {
                    mail_number.focus();
                });
                return;
            }
        }
        GAMECENTER.gsUserSendMailCode(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var mailText = $("#sendMailCode");
            mailText.text("60s后重新发送");
            mailText.removeAttr("onclick");
            mail_code.focus();
            var second = 60;
            var timer = setInterval(function () {
                second--;
                if (second > 0)
                    mailText.text(second + "s后重新发送");
                else {
                    mailText.text("获取验证码");
                    mailText.attr("onclick", "FILLINFO.sendMailCode();");
                    clearInterval(timer);
                }
            }, 1000);
        });
    }
    FILLINFO.sendMailCode = sendMailCode;
    function cognateMail() {
        var mail_number = $("#mailNum");
        var mail_code = $("#mailCode");
        var para = new GAMECENTER.GSUSERSETMAILREQ();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.mail = mail_number.val();
        para.code = mail_code.val();
        para.mysession = GAMECENTER.userinfo.session;
        if (para.mail == "" || para.mail == null) {
            utils.dialogBox("请输入您的邮箱", function () {
                mail_number.focus();
            });
            return;
        }
        else {
            var reg = new RegExp('^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+');
            if (!reg.test(para.mail)) {
                utils.dialogBox("请输入合法的邮箱格式", function () {
                    mail_number.focus();
                });
                return;
            }
        }
        if (para.code == "" || para.code == null) {
            utils.dialogBox("请输入您的邮箱验证码", function () {
                mail_code.focus();
            });
            return;
        }
        GAMECENTER.gsUserSetMail(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            utils.dialogBox("绑定成功", function () {
                GAMECENTER.userinfo.email = para.mail;
                window.location.href = "personInfo.html";
            });
        });
    }
    FILLINFO.cognateMail = cognateMail;
})(FILLINFO || (FILLINFO = {}));
//# sourceMappingURL=fillInfo.js.map