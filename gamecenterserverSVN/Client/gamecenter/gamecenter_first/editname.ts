///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	
	GAMECENTER.UserAutoLogin(userinfo => {
		gceditname.LoadData();

	});
});
module gceditname {
	var goods: GAMECENTER.SHOPGOODSINFO;

	export function LoadData() {
		if (!GAMECENTER.userinfo) {
			window.location.href = "login.shtml";
			return;
		}
		$("#nickname").val(GAMECENTER.userinfo.nickname);

	}
	export function onOK() {
		var para = new GAMECENTER.GSUSERSETNICKNAMEREQ();
		para.mysession = GAMECENTER.userinfo.session;
		para.nickname = $("#nickname").val();
		if (!para.nickname) {
			alert("请输入昵称！");
			return;
		}
		GAMECENTER.gsUserSetNickName(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			history.back();
		});
	}

}