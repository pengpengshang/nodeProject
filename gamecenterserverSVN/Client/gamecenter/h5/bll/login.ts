declare var loadanimate, accountLogin, findPw;
$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo != null && userinfo != undefined) {
            utils.dialogBox("已经登入（" + userinfo.sdkloginid + "）", () => {

                //if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                //    if (!!utils.getExpiresCookies("loginFlags")) {
                //        window.location.href = "../../gamepage.html#423";
                        //window.location.href = "http://www.baidu.com/";
                //    } else {
                //        window.location.href = "index.html";
                //    }
                //} else {
                //    window.location.href = "index.html";
                //}

                window.location.href = "index.html";//已经登入，返回主页
            });
        }
        //utils.setExpiresCookies("loginFlags", "1");
        LOGININDEX_SECOND.onRandNick();
        LOGININDEX_SECOND.getcodeimg();
    });
});
module LOGININDEX_SECOND {
    var img_code = '';
    export function fgLogin() {//5玩账号登入，支持手机账号双登入
        var loginid = $("#wUser").val();
        var pwd = $("#wPwd").val();
        mobileCheck({
            ygUser: loginid,
            wpwd: pwd
        }, function () {
            var para = new GAMECENTER.GSUSERLOGINREQ();
            para.loginid = loginid;
            para.pwd = MD5UTIL.hex_md5(pwd);
            GAMECENTER.gsUserLogin(para, resp => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message, null);
                    return;
                }
                var dat: GAMECENTER.GSUSERLOGINRESP = resp.data;
                if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    window["android"].fg(JSON.stringify(resp.data.userinfo));
                }
                GAMECENTER.userinfo = dat.userinfo;
               
                GAMECENTER.SaveUserInfo();
                // utils.dialogBox("登入成功", () => {
                window.location.href = "index.html";
                // });
            });
        })
    }

    export function fgLogin_old() {//5玩账号登入，支持手机账号双登入
        var loginid = $("#wUser").val();
        var pwd = $("#wPwd").val();
        mobileCheck({
            ygUser: loginid,
            wpwd: pwd
        }, function () {
            var para = new GAMECENTER.GSUSERLOGINREQ();
            para.loginid = loginid;
            para.pwd = MD5UTIL.hex_md5(pwd);
            GAMECENTER.gsUserLogin_old(para, resp => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message, null);
                    return;
                }
                var dat: GAMECENTER.GSUSERLOGINRESP = resp.data;
                if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    window["android"].fg(JSON.stringify(resp.data.userinfo));
                }
                GAMECENTER.userinfo = dat.userinfo;
                GAMECENTER.SaveUserInfo();

                utils.setStorage("login_date", new Date().toLocaleDateString(), localStorage);
                                                                                
                // utils.dialogBox("登入成功", () => {
                window.location.href = "index.html";
                // });
            });
        })
    }


    export function fgReg() {//账号注册操作
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
            } else {
                para.phone = phoneNum;
                para.code = phone_codes;
                para.key = key;
            }
            para.loginid = loginId;
            para.nickname = $("#nickname").val();
            para.pwd = MD5UTIL.hex_md5(pwd);
            GAMECENTER.gsUserReg(para, resp => {
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
                utils.dialogBox("注册成功", () => {
                    window.location.href = "index.html";
                });
            });
        })
    }

    export function onRandNick() {//随机昵称
        GAMECENTER.gsUserRandNick({}, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            $("#nickname").val(resp.data.nickname);
        });
    }
    var key: string;
    export function sendCode(flags) {//发送验证码
        var phone_number = $("#phoneNum");
        var phone_code = $("#phoneCode");
        GAMECENTER.gsUserLoginSendCode({ phone: phone_number.val(), isreg: flags }, resp => {
            if (resp.data) {
                var dat: GAMECENTER.GSUSERSENDPHONECODERESP = resp.data;
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
            var timer = setInterval(() => {
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

    export function fgPhonelogin() {//手机登入
        var phone_number = $("#phoneNum").val();
        var phone_code = $("#phoneCode").val();
        mobileCheck({
            phone: phone_number,
            smsCode: phone_code
        }, function () {
            var para = new GAMECENTER.GSUSERLOGINREQ();
            para.phone = phone_number;
            para.code = phone_code;
            GAMECENTER.gsUserLogin(para, resp => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message, null);
                    return;
                }
                if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
                    window["android"].fg(JSON.stringify(resp.data.userinfo));
                }
                GAMECENTER.userinfo = resp.data.userinfo;
                GAMECENTER.SaveUserInfo();

                utils.setStorage("login_date", new Date().toLocaleDateString(), localStorage);

                // utils.dialogBox("登入成功", () => {
                window.location.href = "index.html";
                //  });
            });
        })
    }



    //export function phone_login() {
    //    var phone_number2 = $("#phoneNum").val();
    //    var para: GAMECENTER.GSUSERLOGINREQ = new GAMECENTER.GSUSERLOGINREQ();
    //    para.phone = phone_number2;
    //    GAMECENTER.phoneLogin(para, resp => {
    //        if (resp.errno != 0) {
    //            utils.dialogBox(resp.message);
    //            return;
    //        }
    //        GAMECENTER.userinfo = resp.data.userinfo;
    //        GAMECENTER.SaveUserInfo();
    //        // utils.dialogBox("登入成功", () => {
    //        window.location.href = "index.html";

    //    })
    //}





    export function QQLogin() {//微端QQ登入
        //console.log(window["android"].qq());
        var qqinfo = JSON.parse(window["android"].qq());
        var para = new GAMECENTER.GSUSERQQLOGINREQ();
        var pwd = (Math.random() * 100000).toFixed(0);
        para.pwd = MD5UTIL.hex_md5(pwd);
        para.nickname = qqinfo.nickname;
        para.qqid = qqinfo.openid;
        para.headico = qqinfo.figureurl_2;
        GAMECENTER.gsUserLogin_qq(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, null);
                return;
            }

            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            // utils.dialogBox("登入成功", () => {
            window.location.href = "index.html";
            //  });
        });
    }
    export function WXLogin() {//微端微信登入
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
        GAMECENTER.gsUserLogin_wx(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, null);
                return;
            }
            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            // utils.dialogBox("登入成功", () => {
            window.location.href = "index.html";
            //  });
        });
    }
    export function fgModifyPwd() {
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
            GAMECENTER.gsUserFindPwdChangePwd(para, resp => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                utils.dialogBox("修改成功", () => {
                    loadanimate(accountLogin());
                    $("#Whead").text("账号登入");
                });
            });
        });
    }

    export function getCode() {//获取修改密码手机验证码
        var loginid = $("#loginid").val();
        var phone_code = $("#phoneCode");
        mobileCheck({

        }, function () {
            var para = new GAMECENTER.USERFINDPWDSENDCODEREQ();
            para.loginid = loginid;
            GAMECENTER.gsUserFindPwdSendCode(para, resp => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                var phoneText = $("#sendCode");
                phoneText.text("60s后重新发送");
                phoneText.removeAttr("onclick");
                phone_code.focus();
                var second = 60;
                var timer = setInterval(() => {
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

    export function mobileCheck(args, callback) {//判断手机登录的参数
        if (!args.ygUser && args.ygUser !== undefined) {
            utils.dialogBox("请输入账号！");
            return
        } else {
            if (!/^[A-Za-z0-9_]*$/.test(args.ygUser)) {
                utils.dialogBox("账号由字母、数字、下划线组成！");
                return;
            }
            if (!args.phone && args.phone !== undefined) {
                utils.dialogBox("请输入手机号！");
                return
            }
            if (!/^1[3|4|5|7|8]\d{9}$/.test(args.phone) && args.phone !== undefined) {
                utils.dialogBox("请填入有效的手机号码！");
                return
            }
        }
        if (args.confirmPwd) {
            if (args.confirmPwd != args.pwd) {
                utils.dialogBox("密码不一致！");
                return
            }
        }
        if (!args.confirmPwd && args.confirmPwd !== undefined) {
            utils.dialogBox("请输入确认密码！");
            return
        }
        if (!args.smsCode && args.smsCode !== undefined) {
            utils.dialogBox("请输入短信验证码！");
            return
        }
        if (!args.pwd && args.pwd !== undefined) {
            utils.dialogBox("请输入密码！");
            return
        }
        if (args.pwd && args.pwd.length < 6) {
            utils.dialogBox("密码长度不能少于6位！");
            return
        }
        if (!args.wpwd && args.wpwd !== undefined) {
            utils.dialogBox("请输入密码！");
            return
        }
        callback();
    }
    export function getcodeimg() {
        var xhr = new XMLHttpRequest();
        var url = "http://192.168.1.206:7031/getidcode_png";
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var game = JSON.parse(xhr.responseText);
                $("#code_img").attr("src", game.codeimg);
                img_code = game.codekey;
            }
        };
    }


} 