$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo != null) {
            //window.location.href = "index.html";
        }
        REGISTER.onRandNick();
    });
});
module REGISTER {//注册模块

    var key: string;
    export function sendCode() {//发送验证码
        var phone_number = $("#res_phone");
        console.log(phone_number.val())
        var phone_code = $("#code_input");
        if (!CheckPhone(phone_number.val())) {
            alert("请输入正确的手机号！");
            phone_number.focus();
            return;
        }
        GAMECENTER.gsUserLoginSendCode({ phone: phone_number.val(), isreg: true }, resp => {
            if (resp.data) {
                var dat: GAMECENTER.GSUSERSENDPHONECODERESP = resp.data;
                key = dat.key;
            }
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
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
    }

    export function fgReg() {//账号注册操作
        var loginId = $("#res").val();
        var pwd1 = $("#res_password").val();
        var pwd2 = $("#res_confirmpassword").val();
        var phoneNum = $("#res_phone").val();
        var phone_codes = $("#code_input").val();
        var para = new GAMECENTER.GSUSERREGREQ();
        if (!loginId) {
            alert("请输入账号！");
            $("#res").focus();
            return;
        }
        if (!pwd1) {
            alert("请输入新密码！");
            $("#res_password").focus();
            return;
        }
        if (!pwd2) {
            alert("请再次输入密码！");
            $("#res_confirmpassword").focus();
            return;
        }
        if (pwd1 != pwd2) {
            alert("两次输入密码不一致！");
            return;
        }
        if (!phoneNum) {
            phoneNum = null;
        } else {
            if (!CheckPhone(phoneNum)) {
                alert("请输入正确的手机号！");
                $("#res_phone").focus();
                return;
            }
            para.phone = phoneNum;
            para.code = phone_codes;
            para.key = key;
        }
        para.loginid = loginId;
        para.nickname = $("#nickname").val();
        para.pwd = MD5UTIL.hex_md5(pwd2);
        GAMECENTER.gsUserReg(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            $("#res").val(null);
            $("#res_password").val(null);
            $("#res_confirmpassword").val(null);
            $("#res_phone").val(null);
            $("#code_input").val(null);
            window.location.href = "regSucc.html";
        });
    }

    export function onRandNick() {//随机昵称
        GAMECENTER.gsUserRandNick({}, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $("#nickname").val(resp.data.nickname);
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