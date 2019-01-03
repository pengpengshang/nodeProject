///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />


$(document).ready(() => {
	gcpayresult.LoadData();
});

module gcpayresult {
	export function LoadData() {

		var cancel = utils.getQueryString("cancel");
		if (cancel)//支付宝点击返回，取消订单
		{

			window.parent.postMessage({ cmd: "paycancel" }, "*");
			return;
		}
		var para = utils.getRequest();
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
		

	}
	
	

}