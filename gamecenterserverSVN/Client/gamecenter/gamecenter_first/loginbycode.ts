///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	gcloginbycode.LoadData();
});
module gcloginbycode {

	export function LoadData() {
		

	}
	function CheckPhone(phone: string):boolean {
		if (phone.length != 11) {
			return false;
		}
		var r, re;
        re = /\d*/i; //\d表示数字,*表示匹配多个数字
        r = phone.match(re);
        return (r == phone) ? true : false;
	}
	export function onSendCode() {
		var phone: string = $("#phone").val();
		if (!CheckPhone(phone)) {
			alert("请输入正确的手机号！");
			$("#phone").focus();
			return;
		}
		GAMECENTER.gsUserLoginSendCode({ phone: phone, isreg:false }, resp => {
		
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			
			var btnsend: HTMLInputElement = <any>document.getElementById("btnsend");
			btnsend.style.backgroundColor = "gray";
			btnsend.value = "60s后重新发送";
			btnsend.disabled = true;
			$("#code").focus();
			var second = 60;
			var timer = setInterval(() => {
				second--;
				if (second > 0)
					btnsend.value = second + "s后重新发送";
				else {
					btnsend.style.backgroundColor = "#4ecc6e";
					btnsend.value = "获取验证码";
					btnsend.disabled = false;
					clearInterval(timer);

				}
			}, 1000);
		});
	}
	export function onOK() {
		var phone: string = $("#phone").val();
		if (!CheckPhone(phone)) {
			alert("请输入正确的手机号！");
			$("#phone").focus();
		}
		var code: string = $("#code").val();
		var para = new GAMECENTER.GSUSERLOGINREQ();
		para.phone = phone;
		para.code = code;
		GAMECENTER.gsUserLogin(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			GAMECENTER.userinfo = resp.data.userinfo;
			GAMECENTER.SaveUserInfo();
			history.go(-2);
		});
	}

}