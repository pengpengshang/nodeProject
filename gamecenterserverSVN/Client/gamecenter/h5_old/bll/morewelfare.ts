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
        MOREWELFARE.loadDefaultData();
    })
});
module MOREWELFARE {
    var gtul: HTMLUListElement = <any>document.getElementById("gtul");
    var gtitem: HTMLLIElement = <any>gtul.firstElementChild;
    var gtitems: HTMLLIElement[] = [];
    export function loadDefaultData() {
        loadWelfareGift();
    }
    export function loadWelfareGift() {
        gtitem.style.display = "none";
        var para: GAMECENTER.GETALLWELFTARETYPEREQ = new GAMECENTER.GETALLWELFTARETYPEREQ();
        para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
        para.typenum = utils.getQueryString("typenum");
        GAMECENTER.GetAllWelftareType(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);;
                return;
            }
            var zf_giftlist: GAMECENTER.GETALLWELFTARETYPEINFO[] = resp.data.zf_giftlist;
            var hh_giftlist: GAMECENTER.GETALLWELFTARETYPEINFO[] = resp.data.hh_giftlist;
            var zz_giftlist: GAMECENTER.GETALLWELFTARETYPEINFO[] = resp.data.zz_giftlist;
            for (var i = 0; i < gtitems.length; i++) {//元素清除操作
                gtul.removeChild(gtitems[i]);
            }
            gtitems.splice(0);
            switch (para.typenum) {
                case '1':
                    loadWelfare(zf_giftlist);
                    break;
                case '2':
                    loadWelfare(hh_giftlist);
                    break;
                case '3':
                    loadWelfare(zz_giftlist);
                    break;
            }
        })
    }
    export function loadWelfare(list) {
        var today = new Date();
        for (var i = 0; list != null && i < list.length; i++) {
            var items: HTMLLIElement = <any>gtitem.cloneNode(true);
            var giftinfo: GAMECENTER.GETALLWELFTARETYPEINFO = list[i];
            var newImage: HTMLImageElement = document.createElement("img");//新游tag
            newImage.setAttribute("src", "../style/img/index/gameTag.png");
            newImage.setAttribute("class", "gameTag");
            var gameDate = new Date(giftinfo.createtime);
            if ((today.getFullYear() == gameDate.getFullYear()) && (today.getMonth() <= gameDate.getMonth() + 2)) {
                $(items).find("#pr_img").append(newImage);
            }
            var nameandtitle = "[" + giftinfo.name + "]" + giftinfo.giftname;
            if (giftinfo.loginid != null) {//当前账号领取礼包情况
                $(items).find("#exclusive_btn").css("background", "#E55659").text("查看");
            }
            $(items).find("#exclusive_title").text(nameandtitle);
            $(items).find("#price").text(giftinfo.price);
            var widthPercent = (((giftinfo.total - giftinfo.remainder) / giftinfo.total) * 100).toFixed(0) + "%";
            if (widthPercent != "NaN%") {//设置进度条，排除出现NaN%情况
                $(items).find("#exclusive_pronum").text("剩" + widthPercent);
                $(items).find("#exclusive_progress").css("width", widthPercent);
            } else {
                $(items).find("#exclusive_pronum").text("剩" + 0 + "%");
                $(items).find("#exclusive_progress").css("width", 0);
            }
            $(items).find("#exclusive_content").text(giftinfo.instruction);
            $(items).find("#fr").attr("href", "morewelftare.html?typenum=" + giftinfo.type);
            (function fun(data: GAMECENTER.GETALLWELFTARETYPEINFO) {
                $(items).find("#exclusive_btn").on("click", function () {
                    var loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                    var userid = utils.getCookie("GSUSERINFO").sdkuserid;
                    var getFlag = $(this).text();
                    if ("查看" == getFlag) {
                        getGiftCode(data.id, loginid, userid, data.gameid, 1, data.type, $(this));
                    } else {
                        getGiftCode(data.id, loginid, userid, data.gameid, 0, data.type, $(this));
                    }
                });
                $(items).find("#gameico").attr("src", giftinfo.ico + "?" + Math.random()).attr("title", giftinfo.name).click(function () {
                    if (utils.getCookie("GSUSERINFO")) {
                        utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
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
            items.style.display = "";
            gtul.appendChild(items);
            gtitems.push(items);
        }
    }
    export function getGiftCode(typeid, loginid, userid, gameid, flags, typenum, doc) {//获取礼包码
        var para: GAMECENTER.GETCODEINFOREQ2 = new GAMECENTER.GETCODEINFOREQ2();
        para.typeid = typeid;
        para.userid = userid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        para.typenum = typenum;
        GAMECENTER.getCodeInfo2(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);;
                return;
            }
            MOREWELFARE.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            } else {
                $("#copyCode").text("来晚了,请等待下次发放");
                $("#copyto").css("display", "none");
            }
            $("#close").click(function () {
                MOREWELFARE.hideMask();
                if ($("#copyCode").text() != "来晚了,请等待下次发放") {
                    doc.css("background", "#E55659").text("查看");
                }
            });
            $("#start").click(function () {
                MOREWELFARE.hideMask();
                if (utils.getCookie("GSUSERINFO")) {
                    utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
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

    export function showMask() {//显示领取页面
        $(".mask").css("display", "block");
    }
    export function hideMask() {//隐藏领取页面
        $(".mask").css("display", "none");
    }
} 