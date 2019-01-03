///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminbannerad.LoadData();

	});
});
module adminbannerad {
	var weeklytable: HTMLTableElement;
	var weeklyitem: HTMLTableRowElement;
	var weeklyitems: HTMLTableRowElement[] = [];

	var shopadtable: HTMLTableElement;
	var shopaditem: HTMLTableRowElement;
	var shopaditems: HTMLTableRowElement[] = [];

	var activitytable: HTMLTableElement;
	var activityitem: HTMLTableRowElement;
	



    export function LoadData() {
		weeklytable = <any>document.getElementById("weeklytable");
		weeklyitem = <any>document.getElementById("weeklyitem");
		weeklyitem.style.display = "none";

		shopadtable = <any>document.getElementById("shopadtable");
		shopaditem = <any>document.getElementById("shopaditem");
		shopaditem.style.display = "none";

		activitytable = <any>document.getElementById("activitytable");
		activityitem = <any>document.getElementById("activityitem");
		activityitem.style.display = "none";



		ADMIN.adminGetWeeklyGoodsList({ loginid: null, pwd: null }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			for (var i = 0; i < weeklyitems.length; i++) {
				weeklytable.removeChild(weeklyitems[i]);
			}
			weeklyitems.splice(0);



			var data: ADMIN.ADMINGETWEEKLYGOODSLISTRESP = resp.data;
			for (var i = 0; i < data.data.length; i++) {
				var dat = data.data[i];
				var item: HTMLTableRowElement = <any>weeklyitem.cloneNode(true);
				item.style.display = "";
				$(item).find("#goodsid").text(dat.goodsid);
				$(item).find("#goodsname").text(dat.name);
				$(item).find("#price").text(dat.price);
				$(item).find("#rmbprice").text(dat.rmbprice);
				$(item).find("#stock").text(dat.stock);
				$(item).find("#img").get(0)["src"] = dat.img+"?"+Math.random();
				$(item).find("#timestart").text(new Date(dat.timestart).toLocaleString());
				$(item).find("#timeend").text(new Date(dat.timeend).toLocaleString());
				(function (dat: ADMIN.WEEKLYGOODINFO) {
					$(item).find("#btnedit").click(ev => {
						sessionStorage['ADMINWEEKLYGOODINFO'] = JSON.stringify(dat);
						window.location.href = "weeklyedit.shtml";
					});
					$(item).find("#btndel").click(ev => {
						if (confirm("是否删除" + dat.name)) {
							ADMIN.adminDelWeeklyGoods({ loginid: null, pwd: null, id: dat.id }, resp => {
								if (resp.errno != 0) {
									alert(resp.message);
									return;
								}
								alert("删除成功");
								LoadData();
							});
						}
					});

				})(dat);
				weeklytable.appendChild(item);
				weeklyitems.push(item);
			}
		});
		ADMIN.adminGetShopAdList({ loginid: null, pwd: null }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			for (var i = 0; i < shopaditems.length; i++) {
				shopadtable.removeChild(shopaditems[i]);
			}
			weeklyitems.splice(0);

			var data2 : ADMIN.ADMINGETSHOPADLISTRESP = resp.data;
			for (var i = 0; i < data2.data.length; i++) {
				var dat2 = data2.data[i];
				var item: HTMLTableRowElement = <any>shopaditem.cloneNode(true);
				item.style.display = "";
				item.querySelector("#goodsid").textContent = dat2.goodsid.toString();
				item.querySelector("#goodsname").textContent = dat2.goodsname;
				item.querySelector("#price").textContent = dat2.price.toString();
				item.querySelector("#rmbprice").textContent = dat2.rmbprice.toString();
				item.querySelector("#stock").textContent = dat2.stock.toString();
				item.querySelector("#img")["src"] = dat2.img + "?" + Math.random();
				(function (dat2: ADMIN.SHOPADINFO) {
					$(item).find("#btnedit").click(ev => {
						sessionStorage['ADMINSHOPADINFO'] = JSON.stringify(dat2);
						window.location.href = "shopadedit.shtml";
					});
					$(item).find("#btndel").click(ev => {
						if (confirm("是否删除？")) {
							ADMIN.adminDelShopAD({ loginid: null, pwd: null, id: dat2.id }, resp => {
								if (resp.errno != 0) {
									alert(resp.message);
									return;
								}
								alert("删除成功");
								LoadData();
							});
						}
					});
				})(dat2);
				shopadtable.appendChild(item);
				shopaditems.push(item);
			}
		});
		ADMIN.adminGetActivityList({ loginid: null, pwd: null }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			while (activitytable.children.length > 1) activitytable.removeChild(activitytable.lastChild);
			var actdat: ADMIN.ADMINGETACTIVITYLISTRESP = resp.data;
			for (var i = 0; i < actdat.data.length; i++) {
				var item: HTMLTableRowElement = <any>activityitem.cloneNode(true);
				var dat = actdat.data[i];
				var url: string;
				item.querySelector("#actimg")["src"] = dat.img + "?" + Math.random();
				if (dat.type == 0)
					url = dat.url;
				else if (dat.type == 1)
                    url = utils.g_serverurl + "gsh5game?id=" + dat.url;
				item.querySelector("#actlink")["href"] = url;
				item.querySelector("#actlink").textContent = url;
				item.querySelector("#orderby").textContent = dat.orderby.toString();

				(function (dat: ADMIN.ACTIVITYINFO) {
					$(item).find("#actedit").click(ev => {
						sessionStorage["ADMINACTIVITYINFO"] = JSON.stringify(dat);
						window.location.href = "activityedit.shtml";
					});
					$(item).find("#actdel").click(ev => {
						if (confirm("是否删除?"))
						{
							ADMIN.adminDelActivity({ loginid: null, pwd: null, id: dat.id }, resp => {
								if (resp.errno != 0) {
									alert(resp.message);
									return;
								}
								alert("删除成功");
								LoadData();
							});
						}
					});
				})(dat);
				item.style.display = "";
				activitytable.appendChild(item);
			}
		});
	}
}