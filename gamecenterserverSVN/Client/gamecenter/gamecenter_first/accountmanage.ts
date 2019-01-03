///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {

	GAMECENTER.UserAutoLogin(userinfo => {
		gcaccountmanage.LoadData();
	});
});
module gcaccountmanage {
	var tabaccount: HTMLTableElement;
	var accountitem: HTMLTableRowElement;
	var accountitems: HTMLTableRowElement[] = [];

	export function LoadData() {
		tabaccount = <any>document.getElementById("tabaccount");
		accountitem = <any>document.getElementById("accountitem");
		accountitem.style.display = "none";
		GAMECENTER.LoadHistoryUsers();
		if (!GAMECENTER.historyUsers) return;


		for (var i = 0; i < accountitems.length; i++) {
			tabaccount.removeChild(accountitems[i]);
		}
		accountitems.splice(0);


		for (var i = GAMECENTER.historyUsers.length - 1;i>=0; i--) {
			var usr = GAMECENTER.historyUsers[i];
			var item: HTMLTableRowElement = <any>accountitem.cloneNode(true);
			item.querySelector("#accountid").textContent = usr.nickname;
			item.querySelector("#accountid").textContent = usr.nickname;
			if (!GAMECENTER.userinfo||usr.userid != GAMECENTER.userinfo.userid) {
				$(item).find("#checkimg").hide();
			}
			item.querySelector("#imghead")["src"] = usr.headico;
			(function (usr: GAMECENTER.HistoryUsers) {
				item.onclick = function (ev) {
					GAMECENTER.userinfo = new GAMECENTER.GSUSERINFO();
					GAMECENTER.userinfo.userid = usr.userid;
					GAMECENTER.userinfo.session = usr.session;
					GAMECENTER.UserAutoLogin(userinfo => {
						if (!userinfo) {//登录失败，需重新输入密码
							alert("用户信息改变，需重新登录！");
							window.location.href = "login.shtml";
						}
						else {
							history.back();
						}
					});
				}
			})(usr);
			item.style.display = "";
			accountitems.push(item);
			
			tabaccount.insertBefore(item, tabaccount.lastChild);
		}

	}
	export function onLogout() {
		GAMECENTER.userinfo = null;
		GAMECENTER.SaveUserInfo();
		window.location.href = "login.shtml";
	}

}