$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "loginIndex.html";
            });
            return
        }
        MOREGIFT_NEW.loadDefaultData();
    })
});
module MOREGIFT_NEW {
    var gtul: HTMLUListElement = <any>document.getElementById("gtul");
    var gtitem: HTMLLIElement = <any>gtul.firstElementChild;
    var gtitems: HTMLLIElement[] = [];
    var lisGiftType: GAMECENTER.GETALLGIFTTYPEINFONEW[] = [];
    export function loadDefaultData() {
        loadGiftTypeData();
    }
    export function loadGiftTypeData() {
        gtitem.style.display = "none";
        var para: GAMECENTER.GETALLGIFTTYPEREQNEW = new GAMECENTER.GETALLGIFTTYPEREQNEW();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.gameid = utils.getQueryString("gameid");
        GAMECENTER.gsGetAllGiftType_New(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);;
                return;
            }
            for (var i = 0; i < gtitems.length; i++) {//元素清除操作
                gtul.removeChild(gtitems[i]);
            }
            gtitems.splice(0);
            var dat: GAMECENTER.GETALLGIFTTYPEINFORESPNEW = resp.data;
            lisGiftType = dat.gtlist;
            for (var i = 0; lisGiftType != null && i < lisGiftType.length; i++) {
                var items: HTMLLIElement = <any>gtitem.cloneNode(true);
                var giftinfo: GAMECENTER.GETALLGIFTTYPEINFONEW = lisGiftType[i];
                if (giftinfo.loginid != null) {//当前账号领取礼包情况
                    $(items).find("#gb_btn").css("background", "#E55659").text("查看");
                }
                $(items).find("#gamename").text(giftinfo.name);
                $(items).find("#useway").text(giftinfo.useway);
                $(items).find("#gb_name").text(giftinfo.giftname);
                (function fun(data: GAMECENTER.GETALLGIFTTYPEINFONEW) {
                    $(items).find("#gb_btn").on("click", function () {
                        var loginid = GAMECENTER.userinfo.sdkloginid;
                        var getFlag = $(this).text();
                        if ("查看" == getFlag) {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        } else {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                    });
                    $(items).find("#gameico").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.gameid;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => {window.parent.location.reload();}, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid;
                                setTimeout(() => {window.parent.location.reload();}, 500);
                            }
                        }
                    });
                })(giftinfo)
                $(items).find("#gb_detail").text(giftinfo.instruction).attr("title", giftinfo.instruction);
                $(items).find("#gb_num").text(giftinfo.total - giftinfo.remainder);
                $(items).find("#gb_allnum").text("(" + giftinfo.sum + ")");
                var widthPercent = ((giftinfo.total - giftinfo.remainder) / giftinfo.total) * 100 + "%";
                if (widthPercent != "NaN%") {//设置进度条，排除出现NaN%情况
                    $(items).find("#gb_progress").css("width", widthPercent);
                } else {
                    $(items).find("#gb_progress").css("width", 0);
                }
                items.style.display = "";
                gtul.appendChild(items);
                gtitems.push(items);
            }
        });
    }

    export function getGiftCode(typeid, loginid, gameid, flags, doc) {//获取礼包码
        var para: GAMECENTER.GETCODEINFOREQ = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getCodeInfo(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);;
                return;
            }
            MOREGIFT_NEW.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            } else {
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
                if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                    if (utils.isMobileBrowser()) {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    } else {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid;
                    }
                } else {
                    if (utils.isMobileBrowser()) {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        setTimeout(() => {window.parent.location.reload();}, 500);
                    } else {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid;
                        setTimeout(() => {window.parent.location.reload();}, 500);
                    }
                }
            });
        });
    }

    export function showMask() {
        $(".mask").css("display", "block");
    }
    export function hideMask() {
        $(".mask").css("display", "none");
    }
}