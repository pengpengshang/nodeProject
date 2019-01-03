///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminpkgameedit.LoadData();

	});
});
module adminpkgameedit {
	var data: ADMIN.PKAPPINFO;
	var icofile: HTMLInputElement;
	var bgfile: HTMLInputElement;
    export function LoadData() {
		icofile = <any>document.getElementById("icofile");
		bgfile = <any>document.getElementById("bgfile");

		var para = sessionStorage["ADMINPKAPPINFO"];
		if (para) {
			data = JSON.parse(para);
		}
		if (data) {
			$("#gameid").text(data.id);
			$("#gamename").val(data.name);
			$("#gameico").get(0)["src"] = data.ico;
			$("#gamebg").get(0)["src"] = data.bg;
			$("#gameurl").val(data.url);
			$("#gamedetail").val(data.detail);
			$("#entrancegold").val(data.entrancegold);
			$("#wingold").val(data.wingold);
			$("#playcount").val(data.playcount);
			$("#opencount").text(data.opencount);
			
			(<HTMLInputElement>document.getElementById("enablerobot")).checked = (data.enablerobot != 0);
			$("#robotdelay").val(data.robotdelay);
			$("#robotscorespeed").val(data.robotscorespeed);
			$("#robotplaytimemax").val(data.robotplaytimemax);
			$("#robotplaytimemin").val(data.robotplaytimemin);
			$("#robotstartwait").val(data.robotstartwait);
			$("#robotwinrate").val(data.robotwinrate);
			$("#robotscoreinterval").val(data.robotscoreinterval);


		}
		else {
			//添加游戏
		}

	}
	export function onSave() {
		var para = new ADMIN.ADMINSAVEPKAPPINFOREQ();
		if(data)para.id = data.id;
		para.detail = $("#gamedetail").val();
		para.entrancegold = $("#entrancegold").val();
		para.name = $("#gamename").val();
		para.playcount = $("#playcount").val();
		para.url = $("#gameurl").val();
		para.wingold = $("#wingold").val();
		
		para.enablerobot = (<HTMLInputElement>document.getElementById("enablerobot")).checked ? 1 : 0;
		para.robotdelay = $("#robotdelay").val();
		para.robotscorespeed = $("#robotscorespeed").val();
		para.robotplaytimemax = $("#robotplaytimemax").val();
		para.robotplaytimemin = $("#robotplaytimemin").val();
		para.robotstartwait = $("#robotstartwait").val();
		para.robotwinrate = $("#robotwinrate").val();
		para.robotscoreinterval=$("#robotscoreinterval").val();

		var file: any;
		if (icofile.files.length > 0) {
			file = icofile.files[0];
		}
		var file2:any;
		if (bgfile.files.length > 0) {
			file2 = bgfile.files[0];
		}
		ADMIN.adminSavePkAppInfo(para, file, file2, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			alert("保存成功!");
			history.back();
		});
	}
	export function onSelIco() {
        $("#gameico").get(0)["src"] = utils.getFileUrl(icofile);
	}
	export function onSelBg() {
        $("#gamebg").get(0)["src"] = utils.getFileUrl(bgfile);
	}
}