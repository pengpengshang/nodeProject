///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminh5games.LoadData();

	});
});
module adminh5games {
	var gametable: HTMLTableElement;
	var gameitem: HTMLTableRowElement;
	var gameitems: HTMLTableRowElement[] = [];

    export function LoadData() {
		gametable = <any>document.getElementById("gametable");
		gameitem = <any>document.getElementById("gameitem");
		gameitem.style.display = "none";

	
		ADMIN.adminGetH5AppList({ loginid: ADMIN.userinfo.loginid, pwd: ADMIN.userinfo.pwd }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			for (var i = 0; i < gameitems.length; i++) {
				gametable.removeChild(gameitems[i]);
			}
			gameitems.splice(0);

			var dat: ADMIN.ADMINGETH5APPLISTRESP = resp.data;
			for (var i = 0; i < dat.applist.length; i++) {
				var data: ADMIN.H5APPINFO = dat.applist[i];
				var item: HTMLTableRowElement = <any>gameitem.cloneNode(true);
				item.style.display = "";
				$(item).find("#appico").get(0)["src"] = data.ico + "?" + Math.random();
				$(item).find("#appname").text(data.name);
				$(item).find("#appdetail").text(data.detail);
				$(item).find("#orderby").text(data.orderby);
				$(item).find("#remark").text(data.remark);

				(function (data: ADMIN.H5APPINFO) {
					$(item).find("#btnmodify").click(ev => {
						sessionStorage["ADMINH5APPINFO"] = JSON.stringify(data);
						window.location.href = "h5gameedit.shtml";
					});
					$(item).find("#btndel").click(ev => {
						if (confirm("是否删除？")) {
							ADMIN.adminDelH5App({ loginid: null, pwd: null, id: data.id }, resp => {
								if (resp.errno != 0) {
									alert(resp.message);
									return;
								}
								LoadData();
							});
						}
					});
				})(data);
				gametable.appendChild(item);
				gameitems.push(item);
			}
		});
	}
}