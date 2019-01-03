$(document).ready(() => {

});
module MODIFYPASS {//修改密码模块
    var key: string;
    export function sendCode() {//发送验证码
        var phone_number = $("#phone_input");
        var phone_code = $("#code_input");
        if (!CheckPhone(phone_number.val())) {
            alert("请输入正确的手机号！");
            phone_number.focus();
            return;
        }
        var para: GAMECENTER.GSUSERSENDPHONECODEREQ = new GAMECENTER.GSUSERSENDPHONECODEREQ();
        para.phone = phone_number.val();
        GAMECENTER.gsCheckPhone(phone_number.val(), resp => {
            if (resp.errno == 1) {
                GAMECENTER.gsGetPhoneCode(para, resp => {
                    if (resp.errno != 0) {
                        alert(resp.message);
                        return;
                    }
                    key = resp.data.key;
                    var btnSend: HTMLInputElement = <any>document.getElementById("btnSend");
                    var phoneText = $(".phone_checktext");
                    phoneText.text("60s后重新发送");
                    btnSend.disabled = true;
                    phone_code.focus();
                    var second = 60;
                    var timer = setInterval(() => {
                        second--;
                        if (second > 0)
                            phoneText.text(second + "s后重新发送");
                        else {
                            phoneText.text("获取验证码");
                            btnSend.disabled = false;
                            clearInterval(timer);
                        }
                    }, 1000);
                });
            } else if (resp.errno == 0) {
                alert("该手机号未存在绑定账号");
                return;
            } else {
                alert(resp.message);
                return;
            }
        });
        //GAMECENTER.gsUserLoginSendCode({ phone: phone_number.val(), isreg: false }, resp => {
        //    if (resp.errno != 0) {
        //        alert(resp.message);
        //        return;
        //    }
        //    var btnSend: HTMLInputElement = <any>document.getElementById("btnSend");
        //    var phoneText = $(".phone_checktext");
        //    phoneText.text("60s后重新发送");
        //    btnSend.disabled = true;
        //    phone_code.focus();
        //    var second = 60;
        //    var timer = setInterval(() => {
        //        second--;
        //        if (second > 0)
        //            phoneText.text(second + "s后重新发送");
        //        else {
        //            phoneText.text("获取验证码");
        //            btnSend.disabled = false;
        //            clearInterval(timer);

        //        }
        //    }, 1000);
        //});

    }

    export function checkValidate() {//验证是不是有权修改
        var miy = $(".icon_yes");
        var mi = $("#modify_index");
        var ml = $("#modify_login");
        var phone_number = $("#phone_input");
        var phone_code = $("#code_input");
        var account = $("#account")
        if (!CheckPhone(phone_number.val())) {
            alert("请输入正确的手机号！");
            phone_number.focus();
            return;
        }
        var code: string = phone_code.val();
        var para = new GAMECENTER.GSUSERSETPHONEREQ();
        para.phone = phone_number.val();
        para.code = code;
        para.key = key;
        GAMECENTER.gsGetPhoneUser(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message)
                return;
            }
            var loginid = resp.data.loginid;
            account.val(loginid);
            mi.css("display", "block");
            ml.css("display", "none");
        });

        //var para = new GAMECENTER.GSUSERLOGINREQ();
        //para.phone = phone_number.val();
        //para.code = phone_code.val();
        //GAMECENTER.gsUserLogin(para, resp => {
        //    if (resp.errno != 0) {
        //        alert("验证码错误");
        //        return;
        //    }
        //    mi.css("display", "block");
        //    ml.css("display", "none");
        //})

    }

export function modifypass() {//修改密码操作
    var para = new GAMECENTER.GSUSERCHANGEPWDREQ2();
    var pwd1 = $("#modify_password").val();
    var pwd2 = $("#modify_confirmpassword").val();
    var loginid = $("#account").val();
    var phone_number = $("#phone_input").val();
    if (!pwd1) {
        alert("请输入新密码！");
        $("#modify_password").focus();
        return;
    }
    if (!pwd2) {
        alert("请再次输入密码！");
        $("#modify_confirmpassword").focus();
        return;
    }
    if (pwd1 != pwd2) {
        alert("两次输入密码不一致！");
        return;
    }
    para.loginid = loginid;
    para.newpwd = MD5UTIL.hex_md5(pwd2);
    para.phone = phone_number;
    GAMECENTER.gsUserChangePwd2(para, resp => {
        if (resp.errno != 0) {
            alert(resp.message);
            return;
        }
        alert("修改成功！");
        window.location.href = "accountSucc.html";
    });
}

function CheckPhone(phone: string): boolean {
    if (phone.length != 11) {
        return false;
    }
    var r, re;
    re = /\d*/i; //\d表示数字,*表示匹配多个数字
    r = phone.match(re);
    return (r == phone) ? true : false;
}
}