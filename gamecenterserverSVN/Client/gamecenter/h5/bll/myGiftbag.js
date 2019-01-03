$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
        MYGIFTBAG.getMyGiftbag();
    });
});
var MYGIFTBAG;
(function (MYGIFTBAG) {
    function getMyGiftbag() {
        var giftlist = document.getElementById("giftbag_list");
        var giftitem = giftlist.firstElementChild;
        var giftitems = [];
        var para = new GAMECENTER.GIFTBAGREQ();
        para.sdkloginid = GAMECENTER.userinfo.sdkloginid;
        giftitem.style.display = "none";
        for (var i = 0; i < giftitems.length; i++) {
            giftlist.removeChild(giftitems[i]);
        }
        giftitems.splice(0);
        GAMECENTER.getMygiftBagList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var mygifinfo = data[i];
                var items = giftitem.cloneNode(true);
                $(items).find("#gift_ico").attr("src", mygifinfo.ico);
                $(items).find("#appname").text(mygifinfo.name);
                $(items).find("#giftname").text(mygifinfo.giftname);
                $(items).find("#gift_code").text(mygifinfo.code);
                (function fun(data) {
                    $(items).find("#gift_detail").click(function (ev) {
                        $("#zhezhao").css("display", "");
                        $("#one_code").text(data.code);
                        $("#one_detail").text(data.instruction);
                        $("#one_theway").text(data.useway);
                    });
                })(mygifinfo);
                items.style.display = "";
                giftlist.appendChild(items);
                giftitems.push(items);
            }
        });
    }
    MYGIFTBAG.getMyGiftbag = getMyGiftbag;
})(MYGIFTBAG || (MYGIFTBAG = {}));
//# sourceMappingURL=myGiftbag.js.map