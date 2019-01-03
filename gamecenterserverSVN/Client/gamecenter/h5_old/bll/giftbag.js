$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "loginIndex.html";
            });
            return;
        }
        GIFTBAG_NEW.loadDefaultData();
    });
});
var GIFTBAG_NEW;
(function (GIFTBAG_NEW) {
    var gtul = document.getElementById("gtul");
    var gtitem = gtul.firstElementChild;
    var gtitems = [];
    var lisGiftType = [];
    function loadDefaultData() {
        loadGiftTypeData();
    }
    GIFTBAG_NEW.loadDefaultData = loadDefaultData;
    function loadGiftTypeData() {
        gtitem.style.display = "none";
        var para = new GAMECENTER.GETALLGIFTTYPEREQNEW();
        para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
        GAMECENTER.gsGetAllGiftType_New(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < gtitems.length; i++) {
                gtul.removeChild(gtitems[i]);
            }
            gtitems.splice(0);
            var dat = resp.data;
            lisGiftType = dat.gtlist;
            for (var i = 0; lisGiftType != null && i < lisGiftType.length; i++) {
                var items = gtitem.cloneNode(true);
                var giftinfo = lisGiftType[i];
                if (giftinfo.loginid != null) {
                    $(items).find("#gb_btn").css("background", "#E55659").text("查看");
                }
                $(items).find("#gamename").text(giftinfo.name);
                $(items).find("#useway").text(giftinfo.useway);
                $(items).find("#gb_name").text(giftinfo.giftname);
                (function fun(data) {
                    $(items).find("#gb_btn").on("click", function () {
                        var loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                        var getFlag = $(this).text();
                        if ("查看" == getFlag) {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        }
                        else {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                    });
                    $(items).find("#gameico").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                            }
                            else {
                                window.location.href = "../../gamepage.html#" + data.gameid;
                            }
                        }
                        else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                                setTimeout(function () { window.parent.location.reload(); }, 500);
                            }
                            else {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid;
                                setTimeout(function () { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                    $(items).find("#gb_more").click(function () {
                        $(this).closest("li").find("#extragift").fadeIn("slow");
                        var extralist = $(this).closest("li").find("#extragift");
                        var extraitem = $(extralist).find("li");
                        $(extraitem).css("display", "none");
                        var para = new GAMECENTER.GETALLGIFTTYPEREQNEW();
                        para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                        para.gameid = data.gameid.toString();
                        GAMECENTER.gsGetAllGiftType_New(para, function (resp) {
                            if (resp.errno != 0) {
                                utils.dialogBox(resp.message);
                                return;
                            }
                            var dat = resp.data;
                            var lisGiftType = dat.gtlist;
                            for (var i = 1; lisGiftType != null && i < lisGiftType.length; i++) {
                                var items = $(extraitem).clone(true, true);
                                var giftinfo = lisGiftType[i];
                                if (giftinfo.loginid != null) {
                                    $(items).find("#gb_btn1").css("background", "#E55659").text("查看");
                                }
                                $(items).find("#gamename1").text(giftinfo.name);
                                $(items).find("#useway1").text(giftinfo.useway);
                                $(items).find("#gb_name1").text(giftinfo.giftname);
                                (function fun(data) {
                                    $(items).find("#gb_btn1").on("click", function () {
                                        var loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                                        var getFlag = $(this).text();
                                        if ("查看" == getFlag) {
                                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                                        }
                                        else {
                                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                                        }
                                    });
                                })(giftinfo);
                                $(items).find("#gb_detail1").text(giftinfo.instruction).attr("title", giftinfo.instruction);
                                $(items).find("#gb_num1").text(giftinfo.total - giftinfo.remainder);
                                var widthPercent = ((giftinfo.total - giftinfo.remainder) / giftinfo.total) * 100 + "%";
                                if (widthPercent != "NaN%") {
                                    $(items).find("#gb_progress1").css("width", widthPercent);
                                }
                                else {
                                    $(items).find("#gb_progress1").css("width", 0);
                                }
                                $(items).css("display", "");
                                $(extralist).append(items);
                            }
                        });
                        $(this).remove();
                    });
                })(giftinfo);
                $(items).find("#gb_detail").text(giftinfo.instruction).attr("title", giftinfo.instruction);
                $(items).find("#gb_num").text(giftinfo.total - giftinfo.remainder);
                //$(items).find("#gb_more").attr("href", "moregift.html?gameid=" + giftinfo.gameid);
                if (giftinfo.sum - 1 == 0) {
                    $(items).find("#gb_more").remove();
                    $(items).find("#clear").css({ "border-bottom": "none", "margin-bottom": "0px" });
                }
                else {
                    $(items).find("#gb_allnum").text("(" + (giftinfo.sum - 1) + ")");
                }
                var widthPercent = ((giftinfo.total - giftinfo.remainder) / giftinfo.total) * 100 + "%";
                if (widthPercent != "NaN%") {
                    $(items).find("#gb_progress").css("width", widthPercent);
                }
                else {
                    $(items).find("#gb_progress").css("width", 0);
                }
                items.style.display = "";
                gtul.appendChild(items);
                gtitems.push(items);
            }
        });
    }
    GIFTBAG_NEW.loadGiftTypeData = loadGiftTypeData;
    function getGiftCode(typeid, loginid, gameid, flags, doc) {
        var para = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getCodeInfo(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            GIFTBAG_NEW.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            }
            else {
                $("#copyCode").text("来晚了,请等待下次发放");
                $("#copyto").css("display", "none");
            }
            $("#close").click(function () {
                GIFTBAG_NEW.hideMask();
                if ($("#copyCode").text() != "来晚了,请等待下次发放") {
                    doc.css("background", "#E55659").text("查看");
                }
            });
            $("#start").click(function () {
                GIFTBAG_NEW.hideMask();
                if (utils.getCookie("GSUSERINFO")) {
                    utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                }
                if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                    if (utils.isMobileBrowser()) {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid;
                    }
                }
                else {
                    if (utils.isMobileBrowser()) {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                        setTimeout(function () { window.parent.location.reload(); }, 500);
                    }
                    else {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid;
                        setTimeout(function () { window.parent.location.reload(); }, 500);
                    }
                }
            });
        });
    }
    GIFTBAG_NEW.getGiftCode = getGiftCode;
    function showMask() {
        $(".mask").css("display", "block");
    }
    GIFTBAG_NEW.showMask = showMask;
    function hideMask() {
        $(".mask").css("display", "none");
    }
    GIFTBAG_NEW.hideMask = hideMask;
})(GIFTBAG_NEW || (GIFTBAG_NEW = {}));
//# sourceMappingURL=giftbag.js.map