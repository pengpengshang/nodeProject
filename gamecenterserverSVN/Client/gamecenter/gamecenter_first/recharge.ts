///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	
	GAMECENTER.UserAutoLogin(userinfo => {
		gcrecharge.LoadData();

	});
});
module gcrecharge {
	var paytype: number = 1;//0：微信，1：支付宝
	var selgold: number;
	var param: GAMECENTER.GSUSERPAYCREATEREQ;

	var payid: string;
	var discount: GAMECENTER.GSUSERPAYDISCOUNTRESP;

	export function LoadData() {
		

		document.getElementById("discountdiv").style.display = "none";

		GAMECENTER.gsUserPayDiscount({}, resp => {
			if (resp.errno != 0) return;
			discount = resp.data;
			if (discount.discount != 10) {
				document.getElementById("discountdiv").style.display = "";
				$("#discounttext").text(discount.discounttext);
				
			}
			onSel(1000);
		});

/*
		var cancel = getQueryString("cancel");
		if (cancel)//支付宝点击返回，取消订单
		{
			
			window.parent.postMessage({ cmd: "paycancel" }, "*");
			return;
		}
		var para = getRequest();
		var havepara = false;
		for (var i in para) {
			havepara = true;
			break;
		}
		if (havepara) {
			if (parent) {
				parent.window.postMessage({ cmd: "payresult", data: para }, "*");
			}
			
		}
		else*/
		{
		

			param = new GAMECENTER.GSUSERPAYCREATEREQ();
			var href = window.location.href;
			var j = href.indexOf("?");
			if (j >= 0) {
				href = href.substr(0, j);
			}
			//param.showurl = href;
			param.showurl = utils.g_fronturl + "gamecenter/payresult.shtml";
		}
		
	}

	export function onSel(gold: number) {
		selgold = gold;
		document.getElementById("gold1000").className = "goldbtn";
		document.getElementById("gold5000").className = "goldbtn";
		document.getElementById("gold10000").className = "goldbtn";
		document.getElementById("gold25000").className = "goldbtn";
		document.getElementById("gold50000").className = "goldbtn";
		document.getElementById("gold100000").className = "goldbtn";
		document.getElementById("gold" + gold).className = "goldbtnsel";
		var rmb = gold / 1000;
		var rmbpay = rmb;
		if (discount) rmbpay = rmb * discount.discount / 10;
		$("#rmb").text(rmb.toFixed(2));
		$("#rmbpay").text(rmbpay.toFixed(2));
		if (discount) {
			$("#discountrmb").text((rmb - rmbpay).toFixed(2));
		}
	}
	export function selWX() {
		$("#imgchkwx").get(0)["src"] = "style/img/选中支付方式 时.png";
		$("#imgchkzfb").get(0)["src"] = "style/img/没选择支付方式 时.png";
		paytype = 0;
	}
	export function selZFB() {
		$("#imgchkwx").get(0)["src"] = "style/img/没选择支付方式 时.png";
		$("#imgchkzfb").get(0)["src"] = "style/img/选中支付方式 时.png";
		paytype = 1;
	}

	function ShowPayZFB(dat: GAMECENTER.GSUSERPAYCREATERESP) {
		payid = dat.payid;
		var divbgpage: HTMLDivElement;
		var iframe: HTMLIFrameElement;
		var len = history.length;
		window.addEventListener("message", function onmsg(ev) {
			switch (ev.data.cmd) {
				case "paycancel":
					SetScaleWidth();
					SDKUTIL.RemoveIFrame(divbgpage, iframe);
					window.removeEventListener("message", onmsg);
					GAMECENTER.gsUserPayDel({ mysession: GAMECENTER.userinfo.session, payid: payid }, resp => {
						if (resp.errno != 0) {
							alert(resp.message);
							var len2 = history.length;
							if (len2 > len) {//解决点返回无效的问题
								history.back(-1 * (len2 - len));
							}
							return;
						}
						var len2 = history.length;
						if (len2 > len) {
							history.back(-1 * (len2 - len));
						}
					});

					break;
				case "payresult":
					var para = ev.data.data;
					SetScaleWidth();
					SDKUTIL.RemoveIFrame(divbgpage, iframe);
					window.removeEventListener("message", onmsg);
					GAMECENTER.gsUserWaitPayResult({ query: para }, resp => {
						if (resp.errno == 0) {
							alert("支付成功！");
							var len2 = history.length;

							history.back(-1 * (len2 - len + 1));

						}
						else {
							alert(resp.message);
							var len2 = history.length;

							history.back(-1 * (len2 - len + 1));

						}
					});
			}
		});

		//支付宝，在iframe中进入支付宝，绕过微信封杀
		SetAutoWidth();
		SDKUTIL.ShowIFrame(dat.payurl, true, (ev, divpg, ifr) => {
			divbgpage = divpg;
			iframe = ifr;
		});
		
	}
	function ShowPayWX(dat: GAMECENTER.GSUSERPAYCREATERESP) {
		utils.setCookie("GSUSERPAYCREATERESP", dat);
		window.location.href = dat.payurl;
	}
	
	export function onOK() {

		param.mysession = GAMECENTER.userinfo.session;
		param.goodsname = selgold + "K币";
		param.gold = selgold;
//		param.money = (selgold / 1000).toFixed(2);
//		param.money = "0.01";
		param.paytype = paytype;
		GAMECENTER.gsUserPayCreate(param, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			var dat: GAMECENTER.GSUSERPAYCREATERESP = resp.data;
			if (paytype == 1)
				ShowPayZFB(dat);
			else
				ShowPayWX(dat);
		});
	}

	function SetAutoWidth() {//让支付宝能正确适应屏幕
		var metaEl:any = document.querySelector('meta[name="viewport"]'),
			metaCtt = metaEl ? metaEl.content : '',
			matchScale = metaCtt.match(/initial\-scale=([\d\.]+)/),
			matchWidth = metaCtt.match(/width=([^,\s]+)/);
		metaEl.content = "width=device-width";
	}
	function SetScaleWidth() {
		var metaEl: any = document.querySelector('meta[name="viewport"]'),
			metaCtt = metaEl ? metaEl.content : '',
			matchScale = metaCtt.match(/initial\-scale=([\d\.]+)/),
			matchWidth = metaCtt.match(/width=([^,\s]+)/);
		metaEl.content = "width = 1080, user - scalable=no";
		mobileUtil.fixScreen();
	}
}