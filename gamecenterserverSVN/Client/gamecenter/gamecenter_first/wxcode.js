///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
//微信支付获得授权
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', h5wxcode.onBridgeReady, false);
            }
            else if (document["attachEvent"]) {
                document["attachEvent"]('WeixinJSBridgeReady', h5wxcode.onBridgeReady);
                document["attachEvent"]('onWeixinJSBridgeReady', h5wxcode.onBridgeReady);
            }
        }
        else {
            h5wxcode.onBridgeReady();
        }
    });
});
var h5wxcode;
(function (h5wxcode) {
    function LoadData() {
        var code = getQueryString("code");
        var state = getQueryString("state");
        var para = new GAMECENTER.GSUSERWXCODEREQ();
        para.code = code;
        para.state = state;
        GAMECENTER.gsUserWxCode(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                window.location.href = "recharge.shtml";
                return;
            }
            var ret = resp.data;
            WeixinJSBridge.invoke('getBrandWCPayRequest', ret.data, function (res) {
                //					alert(JSON.stringify(res));
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    GAMECENTER.gsUserQueryWxPay({ payid: state }, function (resp) {
                        if (resp.errno != 0) {
                            alert(resp.message);
                            window.location.replace("recharge.shtml");
                            return;
                        }
                        window.location.href = "index.shtml";
                    });
                }
                else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    var pa = new GAMECENTER.GSUSERPAYDELREQ();
                    pa.mysession = GAMECENTER.userinfo.session;
                    pa.payid = state;
                    GAMECENTER.gsUserPayDel(pa, function (resp) {
                        window.location.replace("recharge.shtml");
                    });
                }
            });
        });
    }
    h5wxcode.LoadData = LoadData;
    function onBridgeReady() {
        LoadData();
    }
    h5wxcode.onBridgeReady = onBridgeReady;
})(h5wxcode || (h5wxcode = {}));
//# sourceMappingURL=wxcode.js.map