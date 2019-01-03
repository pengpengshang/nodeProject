///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	
	GAMECENTER.UserAutoLogin(userinfo => {
		gcexchangerecord.LoadData();

	});
});
module gcexchangerecord {
	var recordlist: HTMLDivElement;
	var recorditem: HTMLDivElement;
	var recorditems: HTMLDivElement[] = [];
	export function LoadData() {
		if (!GAMECENTER.userinfo)
		{
			window.location.href = "login.shtml";
			return;
		}
		recordlist = <any>document.getElementById("recordlist");
		recorditem = <any>document.getElementById("recorditem");
		recorditem.style.display = "none";


		GAMECENTER.gsUserGetExchangeRecord({ mysession: GAMECENTER.userinfo.session }, resp => {
			if (resp.errno) {
				alert(resp.message);
				history.back();
				return;
			}
			for (var i = 0; i < recorditems.length; i++) {
				recordlist.removeChild(recorditems[i]);
			}
			recorditems.splice(0);

			var data: GAMECENTER.GSUSERGETEXCHANGERECORDRESP = resp.data;
			if (data.data.length > 0) {
				$("#norecord").hide();
			}
			for (var i = 0; i < data.data.length; i++) {
				var dat = data.data[i];
				var item: HTMLDivElement = <any>recorditem.cloneNode(true);
				item.style.display = "";
				$(item).find("#goodsname").text(dat.goodsname);
				$(item).find("#time").text(new Date(dat.createtime).toLocaleString());
				$(item).find("#message").text(dat.message);
				if (dat.state == 0) {
					$(item).find("#state").text("已兑换");
				}
				else if (dat.state == 1) {
					$(item).find("#state").text("兑换成功");
				}
				recordlist.appendChild(item);
				recorditems.push(item);
			}
		});
	}


}