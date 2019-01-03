var _this = this;
$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if ((_this.parent == _this) || (utils.isMobileBrowser())) {
            if (userinfo == null) {
                alert("尚未登入，请先登入");
                window.location.href = "loginIndex.html";
            }
            else {
                GIFTOFBAG.loadDefaultData();
            }
        }
        else {
            GIFTOFBAG.loadDefaultData();
        }
    });
});
var GIFTOFBAG;
(function (GIFTOFBAG) {
    var gtul = document.getElementById("gtul");
    var gtitem = gtul.firstElementChild;
    var gtitems = [];
    var lisGiftType = [];
    function loadDefaultData() {
        gtitem.style.display = "none";
        var para = new GAMECENTER.GETALLGIFTTYPEREQ();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        GAMECENTER.gsGetAllGiftType(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < gtitems.length; i++) {
                gtul.removeChild(gtitems[i]);
            }
            gtitems.splice(0);
            var dat = resp.data;
            lisGiftType = dat.gtlist;
            if (lisGiftType.length == 0) {
                $("#moregift").text("暂无礼包");
                return;
            }
            AddGiftTypeToList(0, Math.min(lisGiftType.length, 10));
            if (lisGiftType.length <= 10) {
                $("#moregift").hide();
            }
        });
    }
    GIFTOFBAG.loadDefaultData = loadDefaultData;
    var content = $(".content");
    var gbBtn1 = $("#gb_btn1");
    var gbBtn2 = $("#gb_btn2");
    var dialog = $("#dialog");
    var gb_mask = $("#gb_mask");
    var linghao = $("#linghao");
    var dialog = $(".gb-dialog");
    function show() {
        dialog.css("display", "block");
        gb_mask.css("display", "block");
    }
    function hide() {
        dialog.css("display", "none");
        gb_mask.css("display", "none");
        content.css({
            "overflow-y": "auto",
            "overflow-x": "hidden"
        });
    }
    gbBtn1.click(hide);
    gbBtn2.click(hide);
    function AddGiftTypeToList(start, count) {
        for (var i = start; i < start + count; i++) {
            var items = gtitem.cloneNode(true);
            var giftinfo = lisGiftType[i];
            $(items).find("#gameico").attr("src", giftinfo.ico + "?" + Math.random());
            $(items).find("#giftname").text(giftinfo.giftname);
            $(items).find("#instruction").text(giftinfo.instruction).attr("title", giftinfo.instruction);
            $(items).find("#remainder").text(giftinfo.total - giftinfo.remainder);
            if (giftinfo.loginid != null) {
                $(items).find("#getcode").css("background", "#E55659").text("已领取");
            }
            var widthPercent = ((giftinfo.total - giftinfo.remainder) / giftinfo.total) * 100 + "%";
            if (widthPercent != "NaN%") {
                $(items).find("#percent").css("width", widthPercent);
            }
            else {
                $(items).find("#percent").css("width", 0);
            }
            (function fun(data) {
                $(items).find("#gameico").click(function () {
                    if (GAMECENTER.userinfo) {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    }
                    window.location.href = "../../gamepage.html#" + data.gameid;
                });
                $(items).find("#linhao").on("click", function () {
                    show();
                    content.css({
                        "overflow": "hidden"
                    });
                    var conHeight = content.scrollTop();
                    dialog.css({
                        "top": conHeight + 400 + "px"
                    });
                    var contentHeight = content.height();
                    gb_mask.css("height", contentHeight + conHeight);
                    var loginid = GAMECENTER.userinfo.sdkloginid;
                    if ($(this).find('a').text() == "已领取") {
                        getGiftCode(data.id, loginid, data.gameid, 1, $(this).find('a'), data.useway);
                    }
                    else {
                        getGiftCode(data.id, loginid, data.gameid, 0, $(this).find('a'), data.useway);
                    }
                });
            })(giftinfo);
            items.style.display = "";
            gtul.appendChild(items);
            gtitems.push(items);
        }
    }
    function getGiftCode(typeid, loginid, gameid, flags, doc, useway) {
        var para = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getCodeInfo(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $("#gb_useway").text("使用方法：" + useway);
            if (!!resp.data.code) {
                $("#copyCode").val(resp.data.code);
                $("#copyto").css("display", "");
            }
            else {
                $("#copyCode").val("来晚了,请等待下次发放");
                $("#copyto").css("display", "none");
            }
            $("#gb_btn1").click(function () {
                if ($("#copyCode").val() != "来晚了,请等待下次发放") {
                    doc.css("background", "#E55659").text("已领取");
                }
            });
            $("#gb_btn2").click(function () {
                if (GAMECENTER.userinfo) {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                }
                window.location.href = "../../gamepage.html#" + resp.data.gameid;
            });
        });
    }
    GIFTOFBAG.getGiftCode = getGiftCode;
    function onMoreGift() {
        var count = lisGiftType.length - gtitems.length;
        if (count <= 0)
            return;
        AddGiftTypeToList(gtitems.length, count);
        $("#moregift").hide();
    }
    GIFTOFBAG.onMoreGift = onMoreGift;
})(GIFTOFBAG || (GIFTOFBAG = {}));
//# sourceMappingURL=giftofbag.js.map