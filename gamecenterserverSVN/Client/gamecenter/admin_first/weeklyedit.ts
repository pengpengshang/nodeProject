///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {

	ADMIN.adminCheckLogin(userinfo => {
		adminweeklyedit.LoadData();

	});
});
module adminweeklyedit {
	var imgfile: HTMLInputElement;
	var goodslist: HTMLSelectElement;

	var data: ADMIN.WEEKLYGOODINFO;


    export function LoadData() {
		imgfile = <any>document.getElementById("imgfile");

		goodslist = <any>document.getElementById("goodslist");

		var para: string = sessionStorage['ADMINWEEKLYGOODINFO'];
		if(para)
			data = JSON.parse(para);
		



		ADMIN.adminGetShopGoodsList({ loginid: null, pwd: null }, resp => {
			if (resp.errno) {
				alert(resp.message);
				return;
			}
			var data: ADMIN.ADMINGETSHOPGOODSLISTRESP = resp.data;
			for (var i = 0; i < data.goodslist.length; i++) {
				var goods = data.goodslist[i];
				var opt: HTMLOptionElement = document.createElement("option");
				opt.innerText = goods.name;
				opt.value = goods.id.toString();
				goodslist.appendChild(opt);
			}
			ShowData();

		});


		

	}
	function ShowData() {
		if (data) {
			$("#dataid").text(data.id);
			$("#goodslist").val(data.goodsid);
			$("#goodsimg").get(0)["src"] = data.img;
			$("#timestart").val(new Date(data.timestart).toLocaleString());
			$("#timeend").val(new Date(data.timeend).toLocaleString());

		}
	}
	export function onSave() {
		var para = new ADMIN.ADMINSAVEWEEKLYGOODSINFOREQ();
		if (data) para.id = data.id;
		para.goodsid = $("#goodslist").val();
		if (!para.goodsid) {
			alert("请选择商品!");
			return;
		}
		var str = $("#timestart").val();
		para.timestart = $("#timestart").val();
		para.timeend = $("#timeend").val();
		var file;
		if (imgfile.files.length > 0) file = imgfile.files[0];
		ADMIN.adminSaveWeeklyGoodsInfo(para,file, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			alert("保存成功");
			history.back();
		});
	}

	export function onSelImg() {
		$("#goodsimg").get(0)["src"] = utils.getFileUrl(imgfile);
	}
}