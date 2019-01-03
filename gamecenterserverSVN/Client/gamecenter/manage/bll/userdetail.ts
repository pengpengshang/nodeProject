$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminuserdetail_new.LoadData();

	});
});
module adminuserdetail_new {
	var selsdktype: HTMLSelectElement;
	var datatable: HTMLTableElement;
	var dataheader: HTMLTableRowElement;
	var dataitem: HTMLElement;
	var userid: string;
	var is5wanuser: boolean;

    export function LoadData() {

		datatable = <any>document.getElementById("datatable");
		dataheader = <any>document.getElementById("dataheader");
		dataitem = <any>document.getElementById("dataitem");
		dataitem.style.display = "none";

		userid = getQueryString("userid");
		is5wanuser = getQueryString("is5wanuser")=="1";
		if (!userid) {
			history.back();
			return;
		}

		search();
	}
	//详单
	export function search() {
		var para = new ADMIN.ADMINGETUSERDETAILREQ();
		para.userid = userid;
		para.is5wanuser = is5wanuser;

		ADMIN.adminGetUserDetail(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			var dat: ADMIN.ADMINGETUSERDETAILRESP = resp.data;
			while (datatable.childElementCount > 1) datatable.removeChild(datatable.lastElementChild);
			for (var i = 0; i < dat.timeinfo.length; i++) {
				var data = dat.timeinfo[i];
				var item: HTMLTableRowElement = <any>dataitem.cloneNode(true);
				item.style.display = "";							
				item.querySelector("#appid").textContent=<any>data.appid;
				item.querySelector("#appname").textContent =data.appname;
				item.querySelector("#sdkid").textContent =<any>data.sdkid;
				item.querySelector("#sdkname").textContent = data.sdkname;
				item.querySelector("#regtime").textContent = new Date(data.regtime).toLocaleString();
				item.querySelector("#lastlogintime").textContent = new Date(data.lastlogintime).toLocaleString();
				item.querySelector("#paytotal").textContent =<any>data.paytotal;
				var paytable: HTMLTableElement = <any>item.querySelector("#paytable");
				var trpayitem: HTMLTableRowElement = <any>paytable.querySelector("#trpayitem");
				trpayitem.style.display = "none";
				var havepay = false;
				for (var j = 0; j < dat.payrecord.length; j++) {
					var paydata = dat.payrecord[j];
					if (paydata.appid == data.appid && paydata.sdkid == data.sdkid) {
						havepay = true;
						var payitem: HTMLTableRowElement = <any>trpayitem.cloneNode(true);
						payitem.style.display = "";
						payitem.querySelector("#payid").textContent = paydata.payid;
						payitem.querySelector("#createtime").textContent = new Date(paydata.createtime).toLocaleString();
						payitem.querySelector("#paytime").textContent = new Date(paydata.paytime).toLocaleString();
						payitem.querySelector("#goodsname").textContent = paydata.goodsname;
						payitem.querySelector("#goodsnum").textContent = <any>paydata.goodsnum;
						payitem.querySelector("#money").textContent = <any>paydata.money;
						payitem.querySelector("#payrmb").textContent = <any>paydata.payrmb;
						if (paydata.state == 0) payitem.querySelector("#state").textContent = "未支付";
						else if (paydata.state == 1) payitem.querySelector("#state").textContent = "支付成功";
						else if (paydata.state == 2) payitem.querySelector("#state").textContent = "支付成功但通知CP失败";
						paytable.appendChild(payitem);

					}
				}
				if (!havepay) {
					item.querySelector("#trpayinfo")["style"].display = "none";
				}
				
				datatable.appendChild(item);
			}
		});
	}
	export function onclose() {
		parent.postMessage({ type: "close" }, "*");
	}


}