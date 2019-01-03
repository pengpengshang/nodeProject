///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gceditaddress.LoadData();
    });
});
var gceditaddress;
(function (gceditaddress) {
    var goods;
    function LoadData() {
        if (!GAMECENTER.userinfo) {
            window.location.href = "login.shtml";
            return;
        }
        var info = sessionStorage["SHOPGOODSINFO"];
        if (!info) {
            history.back();
            return;
        }
        goods = JSON.parse(info);
        $("#addressee").text(GAMECENTER.userinfo.addressee);
        $("#phone").text(GAMECENTER.userinfo.addrphone);
        $("#address").text(GAMECENTER.userinfo.address);
        $("#zipcode").text(GAMECENTER.userinfo.zipcode);
        $("#price").text(goods.price);
        $("#goodsname").text(goods.name);
        $("#nextbtn").click(function (ev) {
            //TODO:检查收件人信息完整
            if (!GAMECENTER.userinfo.addressee) {
                alert("收件人不完整！");
                window.location.href = "edituseraddress.shtml";
                return;
            }
            if (!GAMECENTER.userinfo.addrphone) {
                alert("手机号不完整！");
                window.location.href = "edituseraddress.shtml";
                return;
            }
            if (!GAMECENTER.userinfo.address || !GAMECENTER.userinfo.addressdetail) {
                alert("地址不完整！");
                window.location.href = "edituseraddress.shtml";
                return;
            }
            $(".box").show();
        });
    }
    gceditaddress.LoadData = LoadData;
    function onOK() {
        $(".box").hide();
        var para = new GAMECENTER.GSUSEREXCHANGEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.goodsid = goods.id;
        GAMECENTER.gsUserExchange(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("兑换成功！");
            history.back();
        });
    }
    gceditaddress.onOK = onOK;
})(gceditaddress || (gceditaddress = {}));
//# sourceMappingURL=editaddress.js.map