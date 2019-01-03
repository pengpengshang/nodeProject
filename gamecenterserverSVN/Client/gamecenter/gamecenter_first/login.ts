///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	

});
module gclogin {

	export function onLogin() {
		var para = new GAMECENTER.GSUSERLOGINREQ();
		para.loginid = $("#phone").val();
		para.pwd = MD5UTIL.hex_md5($("#pwd").val());
		if (!para.loginid) {
			alert("请输入手机号");
			$("#phone").focus();
			return;
		}
		if (!para.pwd) {
			alert("请输入密码");
			$("#pwd").focus();
			return;
		}
		GAMECENTER.gsUserLogin(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			var dat: GAMECENTER.GSUSERLOGINRESP = resp.data;
			GAMECENTER.userinfo = dat.userinfo;
			GAMECENTER.SaveUserInfo();
			history.back();

		});
	}

}