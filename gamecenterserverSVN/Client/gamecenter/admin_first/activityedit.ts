///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminactivityedit.LoadData();

	});
});
module adminactivityedit {
	var imgfile: HTMLInputElement;

	var data: ADMIN.ACTIVITYINFO;
	var h5applist: ADMIN.H5APPINFO[];

	var selh5game: HTMLSelectElement;

    export function LoadData() {
		imgfile = <any>document.getElementById("imgfile");
		selh5game = <any>document.getElementById("selh5game");

		var para: string = sessionStorage["ADMINACTIVITYINFO"];
		if(para)
			data = JSON.parse(para);

		

		ADMIN.adminGetH5AppList({ loginid: null, pwd: null }, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			var dat: ADMIN.ADMINGETH5APPLISTRESP = resp.data;
			h5applist = dat.applist;

			for (var i = 0; i < h5applist.length; i++) {
				var opt: HTMLOptionElement = document.createElement("option");
				opt.innerText = h5applist[i].name;
				opt.value = h5applist[i].id.toString();
				selh5game.add(opt, i);
				
			}



			ShowData();
		});
		
		


	}


	function ShowData() {
		if (data) {
			$("#dataid").text(data.id);
			$("#orderby").val(data.orderby);
			$("#img").get(0)["src"] = data.img;

			if (data.type == 0) {
				$("#url").val(data.url);
				selh5game.value = "-1";
			}
			else if (data.type == 1) {
				$("#url").val("");
				selh5game.value = data.url;
			}

		}
	}
	export function onSave() {
		var para = new ADMIN.ADMINSAVEACTIVITYREQ();
		if (data) para.id = data.id;
		var selh5id = selh5game.value;
		if (selh5id == "0") {
			para.url = $("#url").val();
			para.type = 0;
		}
		else {
			para.url = selh5id;
			para.type = 1;
		}
		para.orderby = $("#orderby").val();
		var file;
		if (imgfile.files.length > 0) file = imgfile.files[0];
		ADMIN.adminSaveActivity(para, file, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			alert("保存成功");
			history.back();
		});
	}

	export function onSelImg() {
		$("#img").get(0)["src"] = utils.getFileUrl(imgfile);
	}
}