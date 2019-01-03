///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminexchange.LoadData();

	});
});
module adminexchange {
	var goodstable: HTMLTableElement;
	var goodsitem: HTMLTableRowElement;
	var goodsitems: HTMLTableRowElement[] = [];

    export function LoadData() {
		goodstable = <any>document.getElementById("goodstable");
		goodsitem = <any>document.getElementById("goodsitem");
		goodsitem.style.display = "none";


		ADMIN.admingetExchangeRecord({ loginid: null, pwd: null }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			for (var i = 0; i < goodsitems.length; i++) {
				goodstable.removeChild(goodsitems[i]);
			}
			goodsitems.splice(0);

			var dat: ADMIN.ADMINGETEXCHANGERECORDRESP = resp.data;
			for (var i = 0; i < dat.data.length; i++) {
				var data = dat.data[i];
				var item: HTMLTableRowElement = <any>goodsitem.cloneNode(true);
				item.style.display = "";
				

				$(item).find("#createtime").text(new Date(data.createtime).toLocaleString());
				$(item).find("#userid").text(data.userid);
				$(item).find("#addrphone").text(data.addrphone);
				$(item).find("#goodsname").text(data.goodsname);
				$(item).find("#costgold").text(data.costgold);
				if (data.state == 0) {
					$(item).find("#state").text("已兑换");
					item.style.color = "red";
					item.style.backgroundColor="yellow";
				}
				else {
					$(item).find("#state").text("兑换成功");
				}
				$(item).find("#message").text(data.message);
				


				(function (data: GAMECENTER.EXCHANGERECORD) {
					$(item).find("#btnmodify").click(ev => {
						sessionStorage["EXCHANGERECORD"] = JSON.stringify(data);
						window.location.href = "exchangeedit.shtml";
					});
				
				})(data);
				goodstable.appendChild(item);
				goodsitems.push(item);
			}

		});
	}
}