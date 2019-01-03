///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	gcquickreg.onRandNick();

});
module gcquickreg {

	export function onRandNick() {
		GAMECENTER.gsUserRandNick({}, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			$("#nickname").val(resp.data.nickname);
		});
	}
	

	export function onReg() {
		var para = new GAMECENTER.GSUSERREGREQ();
		para.nickname = $("#nickname").val();
		if (!para.nickname) {
			alert("请输入昵称！");
			$("#nickname").focus();
			return;
		}

		GAMECENTER.gsUserReg(para, resp => {
			if (resp.errno != 0) {
				$("#nickexist").show();
				return;
			}
			GAMECENTER.userinfo = resp.data.userinfo;
			GAMECENTER.SaveUserInfo();
			parent.window.postMessage({
				cmd: "login"
			},"*");
		});
	}
	export function onLogin() {
		parent.window.location.href = "login.shtml";
	}
}