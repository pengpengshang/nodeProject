///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



window.onload = function (ev) {

	GAMECENTER.UserAutoLogin(userinfo => {
		gcchipin.LoadData();

	});
};
module gcchipin {
	var appdata: GAMECENTER.PKAPPINFO;
	export function LoadData() {
		if (!GAMECENTER.userinfo) {
			setTimeout(() => {
				gcglobal.ShowQuickReg();
				//window.location.href = "login.shtml";
			}, 20);
			
			
		}
		



		var id = utils.getQueryString("id");
		if (!id) {
			history.back();
			return;
		} 
		GAMECENTER.gsUserGetPkAppList({ id: parseInt(id) }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			var dat: GAMECENTER.GSUSERGETPKAPPLISTRESP = resp.data;
			if (dat.applist.length == 0) {
				alert("游戏不存在！");
				return;
			}
			appdata = dat.applist[0];

			$("#appico").get(0)["src"] = appdata.ico;
			$("#appname").text(appdata.name);
			$("#entrancegold").text(appdata.entrancegold);
			$("#wingold").text(appdata.wingold);

			$("#gamebg").get(0)["src"] = appdata.bg;

			var betcount: HTMLDivElement = <any>document.getElementById("betcount");
			$(betcount).find("*").remove();
			var bcount: string = "-" + appdata.entrancegold;
			var width = 71 * bcount.length;
			var startx = betcount.clientWidth / 2 - width / 2;
			for (var i = 0; i < bcount.length; i++) {
				function fun(i: number) {
					utils.CreateNumberImg("style/pk/1下注页切图/押注数额.png", bcount.substr(i, 1), true, (img, offsetx, offsety) => {
						img.style.left = startx + (i * 71 - offsetx) + "px";
						img.style.top = 0 + offsety + "px";
						betcount.appendChild(img);
					});
				}
				fun(i);
			}
		});
		if(GAMECENTER.userinfo)
			$("#mygoldremain").text(GAMECENTER.userinfo.gold);
		
	}
	export function onOK() {
		window.location.href = "matching.shtml?para=" + encodeURI(JSON.stringify(appdata));
	}
	export function onCancel() {
		history.back();
	}

}