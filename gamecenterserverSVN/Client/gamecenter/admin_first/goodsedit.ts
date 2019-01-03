///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		admingoodsedit.LoadData();

	});
});
module admingoodsedit {
	var data: GAMECENTER.SHOPGOODSINFO;
	var icofile: HTMLInputElement;
	var imgfile: HTMLInputElement;


    export function LoadData() {
		icofile = <any>document.getElementById("icofile");
		imgfile = <any>document.getElementById("imgfile");

		var para = sessionStorage["SHOPGOODSINFO"]
		if (para) data = JSON.parse(para);
		if (data) {
			$("#goodsid").text(data.id);
			$("#goodsname").val(data.name);
			$("#goodsico").get(0)["src"] = data.ico + "?" + Math.random();
			$("#goodsimg").get(0)["src"] = data.img + "?" + Math.random();
			$("#price").val(data.price);
			$("#rmbprice").val(data.rmbprice);
			$("#stock").val(data.stock);
//			$("#detail").val(data.detail);
			$("#notice").text(data.notice);
		}
		else {
			//添加游戏
		}

	}
	export function onSave() {
		var para = new ADMIN.ADMINSAVEGOODSINFOREQ();
		if (data) para.id = data.id;
		para.name = $("#goodsname").val();
		para.price = $("#price").val();
		para.rmbprice = $("#rmbprice").val();
		para.detail = "";// $("#detail").val();
		para.notice = $("#notice").val();
		para.stock = $("#stock").val();
		ADMIN.adminSaveGoodsInfo(para, icofile.files[0], imgfile.files[0], resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			alert("保存成功！");
			history.back();
			return;
		});
	}
	export function onSelIco() {
        $("#goodsico").get(0)["src"] = utils.getFileUrl(icofile);
	}
	export function onSelImg() {
        $("#goodsimg").get(0)["src"] = utils.getFileUrl(imgfile);
	}
}