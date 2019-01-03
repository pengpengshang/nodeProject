///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminrechargestatistics.LoadData();

	});
});
module adminrechargestatistics {
	var data: ADMIN.RECHARGEINFO[];
	var datatable: HTMLTableElement;
	var dataitem: HTMLTableRowElement;
	var datatable2: HTMLTableElement;
	var dataitem2: HTMLTableRowElement;


    export function LoadData() {
		$("#timestart").val(new Date().toLocaleDateString());
		$("#timeend").val(new Date().toLocaleDateString());
		datatable = <any>document.getElementById("datatable");
		dataitem = <any>document.getElementById("dataitem");
		dataitem.style.display = "none";
		datatable2 = <any>document.getElementById("datatable2");
		dataitem2 = <any>document.getElementById("dataitem2");
		dataitem2.style.display = "none";
		$("#detaildiv").get(0).style.display = "none";
	}
	export function onSearch(day?: number) {
		if (day) {
			var today = new Date();
			$("#timeend").val(today.toLocaleDateString());
			today.setDate(today.getDate() - day + 1);
			$("#timestart").val(today.toLocaleDateString());
		}

		$("#detaildiv").get(0).style.display = "none";
		$("#dailydiv").get(0).style.display = "";


		var para = new ADMIN.ADMINGETRECHARGELISTREQ();
		var timestart = new Date($("#timestart").val());
		timestart.setHours(0, 0, 0, 0);
		para.timestart = timestart.getTime();
		var timeend = new Date($("#timeend").val());
		timeend.setHours(23, 59, 59);
		para.timeend = timeend.getTime();
		ADMIN.adminGetRechargeList(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			data = resp.data.data;
			ShowDailyData();
		});

	}

	//每日汇总
	class DAILYDATA {
		paydate: Date;//日期
		channel: string;//渠道
		paycount: number=0;//充值次数次数
		paymoney: number=0;//付费金额
	}

	function ShowDailyData() {
		while (datatable.children.length > 1) datatable.removeChild(datatable.lastElementChild);
		//合并每天数据
		var totalmoney: number = 0;
		var dict: any = {};//DAILYDATA
		for (var i = 0; i < data.length; i++) {
			var paytime = new Date(data[i].paytime);
			var key = paytime.toLocaleDateString()+"_"+ ((!data[i].channel) ? "":data[i].channel);
			var dat: DAILYDATA = dict[key];
			if (!dat) {
				dat = new DAILYDATA();
				dat.paydate = new Date(data[i].paytime);
				dat.paydate.setHours(0, 0, 0, 0);
				dat.channel = data[i].channel;
				dat.paymoney = data[i].payrmb;
				dat.paycount = 1;
				dict[key] = dat;
			}
			else {
				dat.paymoney += data[i].payrmb;
				dat.paycount++;
			}
			
		}
		for (var j in dict) {
			dat = dict[j];
			var item: HTMLTableRowElement = <any>dataitem.cloneNode(true);
			item.style.display = "";
			item.querySelector("#paydate").textContent = dat.paydate.toLocaleDateString();
			item.querySelector("#channel").textContent = (!dat.channel)?"":dat.channel;
			item.querySelector("#paycount").textContent = dat.paycount.toString();
			item.querySelector("#paymoney").textContent = dat.paymoney.toFixed(2);
			(function (dat: DAILYDATA) {
				item.querySelector("#detail")["onclick"] = (ev) => {
					ShowDetailData(dat.paydate, dat.channel);
					$("#dailydiv").get(0).style.display = "none";
					$("#detaildiv").get(0).style.display = "";
				};
			})(dat);
			
			datatable.appendChild(item);
			totalmoney += dat.paymoney;
		}
		$("#paytotal").text(totalmoney.toFixed(2));
	}
	function ShowDetailData(paydate: Date,channel:string) {
		while (datatable2.children.length > 1) datatable2.removeChild(datatable2.lastElementChild);
		var date = paydate.toLocaleDateString();
		var datalist: ADMIN.RECHARGEINFO[] = [];
		for (var i = 0; i < data.length; i++) {
			if (new Date(data[i].paytime).toLocaleDateString() == date&&data[i].channel==channel) {
				datalist.push(data[i]);
			}
		}
		datalist.sort((a, b) => {
			return b.paytime - a.paytime;
		});
		for (var i = 0; i < datalist.length; i++) {
			var dat = datalist[i];
			var item: HTMLTableRowElement = <any>dataitem2.cloneNode(true);
			item.style.display = "";
			var paytime = new Date(dat.paytime);
			item.querySelector("#paytime").textContent = paytime.toLocaleString();
			item.querySelector("#channel").textContent = (!dat.channel) ? "" : dat.channel;
			item.querySelector("#nickname").textContent = dat.nickname;
			item.querySelector("#phone").textContent = dat.phone;
			item.querySelector("#payid").textContent = dat.payid;
			item.querySelector("#goodsname").textContent = dat.goodsname;
			item.querySelector("#payrmb").textContent = dat.payrmb.toFixed(2);
			

			datatable2.appendChild(item);
		}
	}
}