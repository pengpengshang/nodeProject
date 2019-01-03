$(document).ready(() => {
    
});
module PHONELOGIN{//手机登入模块
    export function onlogin() {
        var phone_number = $("#phone_input");
        var phone_code = $("#code_input");
        if (!CheckPhone(phone_number.val())) {
            alert("请输入正确的手机号！");
            phone_number.focus();
        }
        var para = new GAMECENTER.GSUSERLOGINREQ();
        para.phone = phone_number.val();
        para.code = phone_code.val();
        GAMECENTER.gsUserLogin(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            GAMECENTER.userinfo = resp.data.userinfo;
            GAMECENTER.SaveUserInfo();
            alert("登入成功,点击确定返回首页");
            window.location.href = "../html/index.html";
        });
    }
    export function sendCode() {//验证码发送
        var phone_number = $("#phone_input");
        var phone_code = $("#code_input");
        if (!CheckPhone(phone_number.val())) {
            alert("请输入正确的手机号！");
            phone_number.focus();
            return;
        }
        GAMECENTER.gsUserLoginSendCode({ phone: phone_number.val(), isreg: false }, resp => {
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