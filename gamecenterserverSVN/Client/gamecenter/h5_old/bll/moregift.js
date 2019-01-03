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
        MOREGIFT_NEW.loadDefaultData();
    });
});
var MOREGIFT_NEW;
(function (MOREGIFT_NEW) {
    var gtul = document.getElementById("gtul");
    var gtitem = gtul.firstElementChild;
    var gtitems = [];
    var lisGiftType = [];
    function loadDefaultData() {
        loadGiftTypeData();
    }
    MOREGIFT_NEW.loadDefaultData = loadDefaultData;
    function loadGiftTypeData() {
        gtitem.style.display = "none";
        var para = new GAMECENTER.GETALLGIFTTYPEREQNEW();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.gameid = utils.getQueryString("gameid");
        GAMECENTER.gsGetAllGiftType_New(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                ;
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
                        var loginid = GAMECENTER.userinfo.sdkloginid;
                        var getFlag = $(this).text();
                        if ("查看" == getFlag) {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        }
                        else {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                    });
                    $(items).find("#gameico").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            }
                            else {
                                window.location.href = "../../gamepage.html#" + data.gameid;
                            }
                        }
                        else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(function () { window.parent.location.reload(); }, 500);
                            }
                            else {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid;
                                setTimeout(function () { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                })(giftinfo);
                $(items).find("#gb_detail").text(giftinfo.instruction).attr("title", giftinfo.instruction);
                $(items).find("#gb_num").text(giftinfo.total - giftinfo.remainder);
                $(items).find("#gb_allnum").text("(" + giftinfo.sum + ")");
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
    MOREGIFT_NEW.loadGiftTypeData = loadGiftTypeData;
    function getGiftCode(typeid, loginid, gameid, flags, doc) {
        var para = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getCodeInfo(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                ;
                return;
            }
            MOREGIFT_NEW.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            }
            else {
                $("#copyCode").text("来晚了,请等待下次发放");
                $("#copyto").css("display", "none");
            }
            $("#close").click(function () {
                MOREGIFT_NEW.hideMask();
                if ($("#copyCode").text() != "来晚了,请等待下次发放") {
                    doc.css("background", "#E55659").text("查看");
                }
            });
            $("#start").click(function () {
                MOREGIFT_NEW.hideMask();
                if (GAMECENTER.userinfo) {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                }
                if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                    if (utils.isMobileBrowser()) {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid;
                    }
                }
                else {
                    if (utils.isMobileBrowser()) {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
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
    MOREGIFT_NEW.getGiftCode = getGiftCode;
    function showMask() {
        $(".mask").css("display", "block");
    }
    MOREGIFT_NEW.showMask = showMask;
    function hideMask() {
        $(".mask").css("display", "none");
    }
    MOREGIFT_NEW.hideMask = hideMask;
})(MOREGIFT_NEW || (MOREGIFT_NEW = {}));
//# sourceMappingURL=moregift.js.map