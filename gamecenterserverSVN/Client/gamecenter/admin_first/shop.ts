///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminshop.LoadData();

	});
});
module adminshop {
	var goodstable: HTMLTableElement;
	var goodsitem: HTMLTableRowElement;
	var goodsitems: HTMLTableRowElement[] = [];

    export function LoadData() {
		goodstable = <any>document.getElementById("goodstable");
		goodsitem = <any>document.getElementById("goodsitem");
		goodsitem.style.display = "none";


		ADMIN.adminGetShopGoodsList({ loginid: null, pwd: null }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			for (var i = 0; i < goodsitems.length; i++) {
				goodstable.removeChild(goodsitems[i]);
			}
			goodsitems.splice(0);

			var dat: ADMIN.ADMINGETSHOPGOODSLISTRESP = resp.data;
			for (var i = 0; i < dat.goodslist.length; i++) {
				var data: GAMECENTER.SHOPGOODSINFO = dat.goodslist[i];
				var item: HTMLTableRowElement = <any>goodsitem.cloneNode(true);
				item.style.display = "";
				$(item).find("#goodsid").text(data.id);
				$(item).find("#goodsname").text(data.name);
				$(item).find("#price").text(data.price);
				$(item).find("#rmbprice").text(data.rmbprice);
				$(item).find("#stock").text(data.stock);
//				$(item).find("#detail").text(data.detail);
				$(item).find("#notice").text(data.notice);
				(function (data: GAMECENTER.SHOPGOODSINFO) {
					$(item).find("#btnmodify").click(ev => {
						sessionStorage["SHOPGOODSINFO"] = JSON.stringify(data);
						window.location.href = "goodsedit.shtml";
					});
					$(item).find("#btndel").click(ev => {
						if (confirm("是否删除" + data.name + "?")) {
							ADMIN.adminDelGoods({ loginid: null, pwd: null, id: data.id }, resp => {
								if (resp.errno != 0) {
									alert(resp.message);
									return;
								}
								alert("删除成功!");
								LoadData();
							});
						}
					});
				})(data);
				goodstable.appendChild(item);
				goodsitems.push(item);
			}

		});
	}
}