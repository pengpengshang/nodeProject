///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminflowstatistics.LoadData();

	});
});
module adminflowstatistics {
	var data: ADMIN.FLOWSTATISTICSDATA[];
	var datatable: HTMLTableElement;
	var dataitem: HTMLTableRowElement;

    export function LoadData() {
		$("#timestart").val(new Date().toLocaleDateString());
		$("#timeend").val(new Date().toLocaleDateString());
		datatable = <any>document.getElementById("datatable");
		dataitem = <any>document.getElementById("dataitem");
		dataitem.style.display = "none";
	}
	export function onSearch(day?: number) {
		if (day) {
			var today = new Date();
			$("#timeend").val(today.toLocaleDateString());
			today.setDate(today.getDate() - day + 1);
			$("#timestart").val(today.toLocaleDateString());
		}




		var para = new ADMIN.ADMINGETFLOWSTATISTICSREQ();
		var timestart = new Date($("#timestart").val());
		timestart.setHours(0, 0, 0, 0);
		para.timestart = timestart.getTime();
		var timeend = new Date($("#timeend").val());
		timeend.setHours(23, 59, 59);
		para.timeend = timeend.getTime();
		ADMIN.adminGetFlowStatistics(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			data = resp.data.data;
			ShowData();
		});

	}
	function ShowData() {
		while (datatable.children.length > 1) datatable.removeChild(datatable.lastElementChild);
		//合并每天数据
		var dict: any = {};
		for (var i = 0; i < data.length; i++) {
			var key = (!data[i].channel) ? " ":data[i].channel;
			var dat: ADMIN.FLOWSTATISTICSDATA = dict[key];
			if (!dat) {
                dat = utils.deepCopy(data[i]);
				dict[key] = dat;
			}
			else {
				dat.opencount += data[i].opencount;
				dat.paymoney += data[i].paymoney;
				dat.payusercount += data[i].payusercount;
				dat.regcount += data[i].regcount;
				
			}
			
		}
		for (var j in dict) {
			dat = dict[j];
			var item: HTMLTableRowElement = <any>dataitem.cloneNode(true);
			item.style.display = "";

			item.querySelector("#channel").textContent = (!dat.channel)?"":dat.channel;
			item.querySelector("#opencount").textContent = dat.opencount.toString();
			item.querySelector("#regcount").textContent = dat.regcount.toString();
			item.querySelector("#payusercount").textContent = dat.payusercount.toString();
			item.querySelector("#paymoney").textContent = dat.paymoney.toFixed(2);
			datatable.appendChild(item);
		}
	}
}