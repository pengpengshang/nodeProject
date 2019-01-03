///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {

	GAMECENTER.UserAutoLogin(userinfo => {
		gcusercenter.LoadData();
	});
});
module gcusercenter {
	var headfile: HTMLInputElement;


	export function LoadData() {
		headfile = <any>document.getElementById("headfile");

		if (GAMECENTER.userinfo) {
			$("#gold").text(GAMECENTER.userinfo.gold);
			$("#nickname").text(GAMECENTER.userinfo.nickname);
			$("#divnologin").get(0).style.display = "none";
			$("#divlogined").get(0).style.display = "";
			$("#headico").get(0)["src"] = GAMECENTER.userinfo.headico;
			if (GAMECENTER.userinfo.phone) {
				$("#phone").text(GAMECENTER.userinfo.phone).get(0).style.color = "";

			}
			$("#addrphone").text(GAMECENTER.userinfo.addrphone);
			$("#addressee").text(GAMECENTER.userinfo.addressee);
			$("#address").text(GAMECENTER.userinfo.address+GAMECENTER.userinfo.addressdetail);

			if (!GAMECENTER.userinfo.address) {
				document.getElementById("addaddress").style.display = "";
				document.getElementById("addressdiv").style.display = "none";
			}
			else {
				document.getElementById("addaddress").style.display = "none";
				document.getElementById("addressdiv").style.display = "";
			}

		}
		else {
			$("#gold").text(0);
			$("#nickname").text("未登录");
			$("#divnologin").get(0).style.display = "";
			$("#divlogined").get(0).style.display = "none";

		}
	}
	export function onLogout() {
		GAMECENTER.userinfo = null;
		GAMECENTER.SaveUserInfo();
		window.location.href = "login.shtml";
	}
	export function onHeadClick() {
		if (!GAMECENTER.userinfo) return;
		headfile.click();
	}
	export function onHeadSel() {
		var file;
		if (headfile.files.length > 0) file = headfile.files[0];
		else {
			return;
		}
		GAMECENTER.gsUserSetHeadIco({ mysession:GAMECENTER.userinfo.session }, file, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			var ret: GAMECENTER.GSUSERSETHEADICORESP = resp.data;
			GAMECENTER.userinfo.headico = ret.headico;
			$("#headico").get(0)["src"] = ret.headico + "?" + Math.random();

		});
	}
}