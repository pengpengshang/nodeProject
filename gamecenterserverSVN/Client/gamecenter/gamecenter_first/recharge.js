///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcrecharge.LoadData();
    });
});
var gcrecharge;
(function (gcrecharge) {
    var paytype = 1; //0：微信，1：支付宝
    var selgold;
    var param;
    var payid;
    var discount;
    function LoadData() {
        document.getElementById("discountdiv").style.display = "none";
        GAMECENTER.gsUserPayDiscount({}, function (resp) {
            if (resp.errno != 0)
                return;
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
    gcrecharge.LoadData = LoadData;
    function onSel(gold) {
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
        if (discount)
            rmbpay = rmb * discount.discount / 10;
        $("#rmb").text(rmb.toFixed(2));
        $("#rmbpay").text(rmbpay.toFixed(2));
        if (discount) {
            $("#discountrmb").text((rmb - rmbpay).toFixed(2));
        }
    }
    gcrecharge.onSel = onSel;
    function selWX() {
        $("#imgchkwx").get(0)["src"] = "style/img/选中支付方式 时.png";
        $("#imgchkzfb").get(0)["src"] = "style/img/没选择支付方式 时.png";
        paytype = 0;
    }
    gcrecharge.selWX = selWX;
    function selZFB() {
        $("#imgchkwx").get(0)["src"] = "style/img/没选择支付方式 时.png";
        $("#imgchkzfb").get(0)["src"] = "style/img/选中支付方式 时.png";
        paytype = 1;
    }
    gcrecharge.selZFB = selZFB;
    function ShowPayZFB(dat) {
        payid = dat.payid;
        var divbgpage;
        var iframe;
        var len = history.length;
        window.addEventListener("message", function onmsg(ev) {
            switch (ev.data.cmd) {
                case "paycancel":
                    SetScaleWidth();
                    SDKUTIL.RemoveIFrame(divbgpage, iframe);
                    window.removeEventListener("message", onmsg);
                    GAMECENTER.gsUserPayDel({ mysession: GAMECENTER.userinfo.session, payid: payid }, function (resp) {
                        if (resp.errno != 0) {
                            alert(resp.message);
                            var len2 = history.length;
                            if (len2 > len) {
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
                    GAMECENTER.gsUserWaitPayResult({ query: para }, function (resp) {
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
        SDKUTIL.ShowIFrame(dat.payurl, true, function (ev, divpg, ifr) {
            divbgpage = divpg;
            iframe = ifr;
        });
    }
    function ShowPayWX(dat) {
        utils.setCookie("GSUSERPAYCREATERESP", dat);
        window.location.href = dat.payurl;
    }
    function onOK() {
        param.mysession = GAMECENTER.userinfo.session;
        param.goodsname = selgold + "K币";
        param.gold = selgold;
        //		param.money = (selgold / 1000).toFixed(2);
        //		param.money = "0.01";
        param.paytype = paytype;
        GAMECENTER.gsUserPayCreate(param, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            if (paytype == 1)
                ShowPayZFB(dat);
            else
                ShowPayWX(dat);
        });
    }
    gcrecharge.onOK = onOK;
    function SetAutoWidth() {
        var metaEl = document.querySelector('meta[name="viewport"]'), metaCtt = metaEl ? metaEl.content : '', matchScale = metaCtt.match(/initial\-scale=([\d\.]+)/), matchWidth = metaCtt.match(/width=([^,\s]+)/);
        metaEl.content = "width=device-width";
    }
    function SetScaleWidth() {
        var metaEl = document.querySelector('meta[name="viewport"]'), metaCtt = metaEl ? metaEl.content : '', matchScale = metaCtt.match(/initial\-scale=([\d\.]+)/), matchWidth = metaCtt.match(/width=([^,\s]+)/);
        metaEl.content = "width = 1080, user - scalable=no";
        mobileUtil.fixScreen();
    }
})(gcrecharge || (gcrecharge = {}));
//# sourceMappingURL=recharge.js.map