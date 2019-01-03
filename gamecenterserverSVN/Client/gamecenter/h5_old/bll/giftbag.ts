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
        GIFTBAG_NEW.loadDefaultData();
    })
});
module GIFTBAG_NEW {
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
        para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
        GAMECENTER.gsGetAllGiftType_New(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
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
                    $(items).find("#gb_btn").on("click",function () {
                        var loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                        var getFlag = $(this).text();
                        if ("查看" == getFlag) {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        } else {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                    });
                    $(items).find("#gameico").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                            } else {
                                window.location.href = "../../gamepage.html#" + data.gameid;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                                setTimeout(() => {window.parent.location.reload();}, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.gameid;
                                setTimeout(() => {window.parent.location.reload();}, 500);
                            }
                        }
                    });
                    $(items).find("#gb_more").click(function () {
                        $(this).closest("li").find("#extragift").fadeIn("slow");
                        var extralist: HTMLUListElement = <any>$(this).closest("li").find("#extragift");
                        var extraitem: HTMLLIElement = <any>$(extralist).find("li");
                        $(extraitem).css("display", "none");
                        var para: GAMECENTER.GETALLGIFTTYPEREQNEW = new GAMECENTER.GETALLGIFTTYPEREQNEW();
                        para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                        para.gameid = data.gameid.toString();
                        GAMECENTER.gsGetAllGiftType_New(para, resp => {
                            if (resp.errno != 0) {
                                utils.dialogBox(resp.message);
                                return;
                            }
                            var dat: GAMECENTER.GETALLGIFTTYPEINFORESPNEW = resp.data;
                            var lisGiftType: GAMECENTER.GETALLGIFTTYPEINFONEW[] = dat.gtlist;
                            for (var i = 1; lisGiftType != null && i < lisGiftType.length; i++) {
                                var items: HTMLLIElement = <any>$(extraitem).clone(true,true);
                                var giftinfo: GAMECENTER.GETALLGIFTTYPEINFONEW = lisGiftType[i];
                                if (giftinfo.loginid != null) {//当前账号领取礼包情况
                                    $(items).find("#gb_btn1").css("background", "#E55659").text("查看");
                                }
                                $(items).find("#gamename1").text(giftinfo.name);
                                $(items).find("#useway1").text(giftinfo.useway);
                                $(items).find("#gb_name1").text(giftinfo.giftname);
                                (function fun(data: GAMECENTER.GETALLGIFTTYPEINFONEW) {
                                    $(items).find("#gb_btn1").on("click", function () {
                                        var loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                                        var getFlag = $(this).text();
                                        if ("查看" == getFlag) {
                                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                                        } else {
                                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                                        }
                                    });
                                })(giftinfo)
                                $(items).find("#gb_detail1").text(giftinfo.instruction).attr("title", giftinfo.instruction);
                                $(items).find("#gb_num1").text(giftinfo.total - giftinfo.remainder);
                                var widthPercent = ((giftinfo.total - giftinfo.remainder) / giftinfo.total) * 100 + "%";
                                if (widthPercent != "NaN%") {//设置进度条，排除出现NaN%情况
                                    $(items).find("#gb_progress1").css("width", widthPercent);
                                } else {
                                    $(items).find("#gb_progress1").css("width", 0);
                                }
                                $(items).css("display","");
                                $(extralist).append(items);
                            }
                        });
                        $(this).remove();
                    })
                })(giftinfo)
                $(items).find("#gb_detail").text(giftinfo.instruction).attr("title", giftinfo.instruction);
                $(items).find("#gb_num").text(giftinfo.total - giftinfo.remainder);
                //$(items).find("#gb_more").attr("href", "moregift.html?gameid=" + giftinfo.gameid);
                if (giftinfo.sum - 1 == 0) {
                    $(items).find("#gb_more").remove();
                    $(items).find("#clear").css({ "border-bottom": "none", "margin-bottom": "0px" });
                } else {
                    $(items).find("#gb_allnum").text("(" + (giftinfo.sum-1) + ")");
                }
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
                utils.dialogBox(resp.message);
                return;
            }
            GIFTBAG_NEW.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            } else {
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
                if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                    if (utils.isMobileBrowser()) {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                    } else {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid;
                    }
                } else {
                    if (utils.isMobileBrowser()) {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                        setTimeout(() => {window.parent.location.reload();}, 500);
                    } else {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid;
                        setTimeout(() => {window.parent.location.reload();}, 500);
                    }
                }
            });
        });
    }

    export function showMask() {//显示领取页面
        $(".mask").css("display","block");
    }
    export function hideMask() {//隐藏领取页面
        $(".mask").css("display","none");
    }
}