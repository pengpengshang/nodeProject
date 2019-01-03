///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminexchangeedit.LoadData();

	});
});
module adminexchangeedit {
	var data: GAMECENTER.EXCHANGERECORD;



    export function LoadData() {
		


		data = JSON.parse(sessionStorage["EXCHANGERECORD"]);
		if (data) {
			$("#exchangeid").text(data.id);
			$("#createtime").text(new Date(data.createtime).toLocaleString());
			$("#userid").text(data.userid);
			$("#addressee").text(data.addressee);
			$("#addrphone").text(data.addrphone);
			$("#address").text(data.address+" "+data.addressdetail);
			$("#zipcode").text(data.zipcode);
			(<HTMLInputElement>document.getElementById("state0")).checked = data.state == 0;
			(<HTMLInputElement>document.getElementById("state1")).checked = data.state == 1;
			$("#message").text(data.message);
		}
		else {
			history.back();
		}

	}
	export function onSave() {
		var para = new ADMIN.ADMINSAVEEXCHANGERECORDREQ();
		para.id = data.id;
		para.state = (<HTMLInputElement>document.getElementById("state0")).checked ? 0 : 1;
		para.message = $("#message").text();
		ADMIN.adminSaveExchangeRecord(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			alert("保存成功！");
			history.back();
		});
	}

}