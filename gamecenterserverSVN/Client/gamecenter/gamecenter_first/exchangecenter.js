///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcexchangecenter.LoadData();
    });
});
var gcexchangecenter;
(function (gcexchangecenter) {
    var goodslist;
    var goodsitem;
    var goodsitems = [];
    var adul;
    var aditem;
    var flicking;
    function LoadData() {
        goodslist = document.getElementById("goodslist");
        goodsitem = document.getElementById("goodsitem");
        goodsitem.style.display = "none";
        adul = document.getElementById("adul");
        aditem = document.getElementById("aditem");
        flicking = document.getElementById("flicking");
        aditem.style.display = "none";
        if (GAMECENTER.userinfo)
            $("#mygold").text(GAMECENTER.userinfo.gold);
        LoadGoods();
    }
    gcexchangecenter.LoadData = LoadData;
    function LoadGoods() {
        GAMECENTER.gsUserGetShopGoodsList({ id: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < goodsitems.length; i++) {
                goodslist.removeChild(goodsitems[i]);
            }
            goodsitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.goodslist.length; i++) {
                var item = goodsitem.cloneNode(true);
                var goods = dat.goodslist[i];
                $(item).find("#goodsname").text(goods.name);
                $(item).find("#price").text(goods.price);
                $(item).find("#goodsico").get(0)["src"] = goods.ico;
                (function (goods) {
                    $(item).find("#buy").click(function (ev) {
                        window.location.href = "exchangegoods.shtml?id=" + goods.id;
                    });
                })(goods);
                item.style.display = "inline-block";
                goodslist.appendChild(item);
                goodsitems.push(item);
            }
        });
        GAMECENTER.gsUserGetBannerData({}, function (resp) {
            var dat = resp.data;
            var exchangeinfo = document.getElementById("exchangeinfo");
            var exchangeinfoitem = exchangeinfo.querySelector("#exchangeinfoitem");
            $("#exchangeinfo").find("*").remove();
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
                'MsTransition': 'msTransitionEnd'
            };
            var tranend;
            for (var t in transitions) {
                if (exchangeinfo.style[t] !== undefined) {
                    tranend = transitions[t];
                    break;
                }
            }
            exchangeinfo.addEventListener(tranend, function (ev) {
                //将第一条移到最后一条
                var item = exchangeinfo.children[0];
                var top = parseInt(item.style.top);
                if (top >= 0)
                    return;
                item.style.display = "none";
                exchangeinfo.removeChild(item);
                exchangeinfo.appendChild(item);
                item.style.top = parseInt(exchangeinfo.children[exchangeinfo.children.length - 2]["style"].top) + exchangeinfo.clientHeight + "px";
            });
            if (dat.exchangeInfo.length > 0) {
                for (var i = 0; i < dat.exchangeInfo.length; i++) {
                    var info = dat.exchangeInfo[i];
                    if (!info.phone)
                        continue;
                    var phone = info.phone.substr(0, 4) + "****" + info.phone.substr(info.phone.length - 3);
                    var item = exchangeinfoitem.cloneNode(true);
                    item.innerText = "" + phone + "成功兑换" + info.goods;
                    item.style.top = exchangeinfo.clientHeight * i + "px";
                    exchangeinfo.appendChild(item);
                }
                //设置3秒滚动
                if (dat.exchangeInfo.length > 1) {
                    var exinfotimer = setInterval(function () {
                        var firstidx = 0;
                        for (var i = 0; i < exchangeinfo.children.length; i++) {
                            var item = exchangeinfo.children[i];
                            item.style.display = "";
                            var top = parseInt(item.style.top) - exchangeinfo.clientHeight;
                            item.style.top = top + "px";
                            if (top == 0)
                                firstidx = i;
                        }
                    }, 3000);
                }
            }
            $(flicking).find("*").remove();
            while (adul.children.length > 0)
                adul.removeChild(adul.lastChild);
            for (var i = 0; i < dat.shopad.length; i++) {
                var fli = document.createElement("a");
                fli.href = "javascript://";
                flicking.appendChild(fli);
                var liitem = aditem.cloneNode(true);
                liitem.style.display = "";
                $(liitem).find("img").get(0)["src"] = dat.shopad[i].img;
                (function (shopad) {
                    liitem.onclick = function (ev) {
                        window.location.href = "exchangegoods.shtml?id=" + shopad.goodsid;
                    };
                })(dat.shopad[i]);
                adul.appendChild(liitem);
            }
            SetAdEvent();
        });
    }
    function SetAdEvent() {
        $(".main_visual").hover(function () {
            $("#btn_prev,#btn_next").fadeIn();
        }, function () {
            $("#btn_prev,#btn_next").fadeOut();
        });
        var dragBln = false;
        $(".main_image").touchSlider({
            flexible: true,
            speed: 200,
            btn_prev: $("#btn_prev"),
            btn_next: $("#btn_next"),
            paging: $(".flicking_con a"),
            counter: function (e) {
                $(".flicking_con a").removeClass("on").eq(e.current - 1).addClass("on");
            }
        });
        $(".main_image").bind("mousedown", function () {
            dragBln = false;
        });
        $(".main_image").bind("dragstart", function () {
            dragBln = true;
        });
        $(".main_image a").click(function () {
            if (dragBln) {
                return false;
            }
        });
        var timer = setInterval(function () {
            $("#btn_next").click();
        }, 5000);
        $(".main_visual").hover(function () {
            clearInterval(timer);
        }, function () {
            timer = setInterval(function () {
                $("#btn_next").click();
            }, 5000);
        });
        $(".main_image").bind("touchstart", function () {
            clearInterval(timer);
        }).bind("touchend", function () {
            timer = setInterval(function () {
                $("#btn_next").click();
            }, 5000);
        });
    }
})(gcexchangecenter || (gcexchangecenter = {}));
//# sourceMappingURL=exchangecenter.js.map