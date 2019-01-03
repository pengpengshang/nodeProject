/// <reference path="../../5wansdk.ts" />
/// <reference path="../../jquery.d.ts" />
$(document).ready(() => {
    GAMECENTER.UserAutoLogin(userinfo => {
        
    });
});
module LOGINAFTER {//登入页详细模块
    var key: string;
    export function sendCode() {//发送验证码
        var phone_number = $("#phone_input");
        var phone_code = $("#code_input");
        if (!CheckPhone(phone_number.val())) {
            alert("请输入正确的手机号！");
            phone_number.focus();
            return;
        }
        GAMECENTER.gsCheckPhone(phone_number.val(), resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            GAMECENTER.gsUserSendPhoneCode({ mysession: GAMECENTER.userinfo.session, phone: phone_number.val() }, resp => {
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
        });
    }
    export function cognatePhone() {//关联手机操作
        var pl = $("#phone_login");
        var ps = $('.phone_succ');
        var iy = $(".phone_icon_yes");
        var phone_number = $("#phone_input");
        var phone_code = $("#code_input");
        if (!CheckPhone(phone_number.val())) {
            alert("请输入正确的手机号！");
            phone_number.focus();
            return;
        }
        var code: string = phone_code.val();
        var para = new GAMECENTER.GSUSERSETPHONEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.phone = phone_number.val();
        para.code = code;
        para.key = key;
        GAMECENTER.gsUserSetPhone(para, resp => {
            if (resp.errno != 0) {
                alert("该手机号已经被绑定");
                return;
            }
            phone_number.text(null);
            phone_code.text(null);
            ps.css("display","block");
            pl.css("display", "none");
            window.location.href = "phoneSucc.html";//绑定成功跳转
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