///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
declare var WeixinJSBridge;
//微信支付获得授权
$(document).ready(() => {
	GAMECENTER.UserAutoLogin(userinfo => {
		if (typeof WeixinJSBridge == "undefined") {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', h5wxcode.onBridgeReady, false);
			} else if (document["attachEvent"]) {
				document["attachEvent"]('WeixinJSBridgeReady', h5wxcode.onBridgeReady);
				document["attachEvent"]('onWeixinJSBridgeReady', h5wxcode.onBridgeReady);
			}
		} else {
			h5wxcode.onBridgeReady();
		}
	});
});

module h5wxcode {

	export function LoadData() {
		var code = getQueryString("code");
		var state = getQueryString("state");


		var para = new GAMECENTER.GSUSERWXCODEREQ();
		para.code = code;
		para.state = state;
		GAMECENTER.gsUserWxCode(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				window.location.href = "recharge.shtml";
				return;
			}
			var ret: GAMECENTER.GSUSERWXCODERESP = resp.data;


			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', ret.data,
				function (res) {
//					alert(JSON.stringify(res));
					if (res.err_msg == "get_brand_wcpay_request:ok") {// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
						GAMECENTER.gsUserQueryWxPay({ payid: state }, resp => {
							if (resp.errno != 0) {
								alert(resp.message);
								window.location.replace("recharge.shtml");
								return;
							}
							window.location.href = "index.shtml";
						});

					}
					else if (res.err_msg == "get_brand_wcpay_request:cancel")//取消支付
					{
						
						var pa = new GAMECENTER.GSUSERPAYDELREQ();
						pa.mysession = GAMECENTER.userinfo.session;
						pa.payid = state;
						GAMECENTER.gsUserPayDel(pa, resp => {
							window.location.replace("recharge.shtml");
						});
					}
				}
			);
		});



		
	}
	export function onBridgeReady() {
		LoadData();
		
	}
	
	
}

