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
        MINE.loadDefaultData(userinfo);
    })
});
module MINE {
    export function loadDefaultData(userinfo) {
        loadRecentPlayData();
        loadPowerData(userinfo);
        loadMessageData();
    }

    export function loadRecentPlayData() {
        var h5gamelist: HTMLUListElement = <any>document.getElementById("rplist");
        var h5gameitem: HTMLLIElement = <any>h5gamelist.firstElementChild;
        var h5gameitems: HTMLLIElement[] = [];
        var listRPGame: GAMECENTER.H5APPINFO[] = utils.getStorage("h5rps", "sessionStorage");
        h5gameitem.style.display = "none";
        for (var i = 0; i < h5gameitems.length; i++) {
            h5gamelist.removeChild(h5gameitems[i]);
        }
        h5gameitems.splice(0);
        var today = new Date();
        for (var i = 0; listRPGame != null && i < listRPGame.length; i++) {
            var tjImage = document.createElement("i");//推荐图标生成
            var giftImage = document.createElement("i");//礼包图标生成
            var newImage: HTMLImageElement = document.createElement("img");//新游tag
            tjImage.textContent = "推荐";
            giftImage.textContent = "礼包";
            tjImage.setAttribute("class", "tagtj");
            giftImage.setAttribute("class", "taggb");
            newImage.setAttribute("src", "../style/img/index/gameTag.png");
            newImage.setAttribute("class", "gameTag");
            var appinfo: GAMECENTER.H5APPINFO = listRPGame[i];
            var items: HTMLLIElement = <any>h5gameitem.cloneNode(true);
            $(items).find("#name").text(appinfo.name);
            $(items).find("#detail").text(appinfo.detail).attr("title", appinfo.detail);
            $(items).find("#gamepeople").text(appinfo.playcount);
            var gameDate = new Date(appinfo.createtime);
            if ((today.getFullYear() == gameDate.getFullYear()) && (today.getMonth() <= gameDate.getMonth() + 2)) {
                $(items).find("#hg_img").append(newImage);
            }
            if (appinfo.isrec == 1) {
                $(items).find("#gameName").append(tjImage);
            }
            if (appinfo.hasgift == 1) {
                $(items).find("#gameName").append(giftImage);
            }
            (function fun(data: GAMECENTER.H5APPINFO) {
                $(items).find("#btn").click(ev => {
                    if (GAMECENTER.userinfo) {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    }
                    window.location.href = "../../gamepage.html#" + data.id;
                });
                $(items).find("#gameheadshot").attr("src", appinfo.ico).attr("title", appinfo.name).click(ev => {
                    if (GAMECENTER.userinfo) {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    }
                    if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                        if (utils.isMobileBrowser()) {
                            window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                        } else {
                            window.location.href = "../../gamepage.html#" + data.id;
                        }
                    } else {
                        if (utils.isMobileBrowser()) {
                            window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + JSON.stringify(GAMECENTER.userinfo);
                            setTimeout(() => {window.parent.location.reload();}, 500);
                        } else {
                            window.parent.location.href = "../../gamepage.html#" + data.id;
                            setTimeout(() => {window.parent.location.reload();}, 500);
                        }
                    }
                });
            })(appinfo);
            items.style.display = "";
            h5gamelist.appendChild(items);
            h5gameitems.push(items);
        }
    }

    export function loadPowerData(userinfo: GAMECENTER.GSUSERINFO) {//加载权限
        var power_zs: HTMLImageElement = <any>document.getElementById("power_zs");
        var power_hh: HTMLImageElement = <any>document.getElementById("power_hh");
        var power_zz: HTMLImageElement = <any>document.getElementById("power_zz");
        var power_vip: HTMLImageElement = <any>document.getElementById("power_vip");
        var power_fast: HTMLImageElement = <any>document.getElementById("power_fast");
        var power_xdaccount: HTMLImageElement = <any>document.getElementById("power_xdaccount");
        var power_zdaccount: HTMLImageElement = <any>document.getElementById("power_zdaccount");
        var para: GAMECENTER.GSUSERLVREQ = new GAMECENTER.GSUSERLVREQ();
        para.userid = userinfo.sdkuserid;
        GAMECENTER.gsUserLv(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var res: GAMECENTER.GSUSERLVRESP = resp.data;
            var basePath = "../style/img/permissions/";
            switch (res.gslv) {
                case 15:
                    power_zdaccount.src = basePath + "assignaccount1.png";
                case 14:
                    power_zdaccount.src = basePath + "assignaccount1.png";
                case 13:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 12:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 11:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 10:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 9:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 8:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 7:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 6:
                    power_xdaccount.src = basePath + "highaccount1.png";
                case 5:
                    power_fast.src = basePath + "fastchannel1.png";
                case 4:
                    power_vip.src = basePath + "VIPCUS1.png";
                case 3:
                    power_zz.src = basePath + "supreme1.png";
                case 2:
                    power_hh.src = basePath + "giftbag1.png";
                case 1:
                    power_zs.src = basePath + "minegb1.png";
                    break;
                default:
                    break;
            }
        });
    }

    export function loadMessageData() {//加载消息列表
        var h5msglist: HTMLUListElement = <any>document.getElementById("msglist");
        var h5msgitem: HTMLLIElement = <any>h5msglist.firstElementChild;
        var h5msgitems: HTMLLIElement[] = [];
        h5msgitem.style.display = "none";
        for (var i = 0; i < h5msgitems.length; i++) {
            h5msglist.removeChild(h5msgitems[i]);
        }
        h5msgitems.splice(0);
        GAMECENTER.gsGetMessage({loginid:GAMECENTER.userinfo.sdkloginid}, resp => {//获取消息列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSGETMESSAGEINFO[] = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var msgInfo: GAMECENTER.GSGETMESSAGEINFO = dat[i];
                var items: HTMLLIElement = <any>h5msgitem.cloneNode(true);
                var sflags = document.createElement("sup");
                sflags.style.fontSize = "12px";
                sflags.style.color = "#0399f1";
                if (msgInfo.loginid == null) {
                    sflags.textContent = "(系统)";
                } else {
                    sflags.textContent = "";
                }
                $(items).find("#title").text(msgInfo.title).append(sflags);
                (function fun(data: GAMECENTER.GSGETMESSAGEINFO) {
                    if (data.msglogid == null && data.rsld == null) {
                        $(items).find("#msgImg").attr("src", "../style/img/index/mailclose.png").attr("class", "mailclose");
                        $(items).find("#newFlag").text("NEW");
                        $(items).find("#read").click(function () {
                            readMessage(data.id,data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                            $(this).closest("li").find("#msgImg").attr("src", "../style/img/index/mailopen.png").attr("class", "mailopen");
                            $(this).closest("li").find("#newFlag").text("");
                        });
                    } else {
                        $(items).find("#msgImg").attr("src", "../style/img/index/mailopen.png").attr("class", "mailopen");
                        $(items).find("#newFlag").text("");
                        $(items).find("#read").click(function () {
                            readMessage(data.id,data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                        });
                    }
                    $(items).find("#delete").click(function () {
                        if (window.confirm("删除(" + data.title + ")?")) {
                            deleteMessage(data.id,data.loginid, () => {
                                $(this).closest("li").remove();
                            });
                        }
                    });
                })(msgInfo)
                items.style.display = "";
                h5msglist.appendChild(items);
                h5msgitems.push(items);
            }
        });
    }

    export function readMessage(id,loginid,title,detail,flags){//消息读取,并设置阅读状态
        $("#viewtitle").text(title);
        $("#viewdetail").text(detail);
        showMask();
        $("#del").click(function () {
            if (window.confirm("删除(" + title + ")?")) {
                deleteMessage(id,loginid, () => {
                    utils.dialogBox("删除成功", () => {
                        hideMask();
                    });
                })
            }
        });
        if (flags == "NEW") {
            GAMECENTER.gsSetMsgReadStatus({ id: id, loginid: GAMECENTER.userinfo.sdkloginid }, (resp) => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
            });
        }
    }

    export function deleteMessage(id,loginid,cb) {//删除消息
        GAMECENTER.gsDeleteMsg({ id: id,loginid:loginid }, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, function () {
                    hideMask();
                });
                return;
            }
            cb();
        });
    }

    export function showMask() {
        $(".mask").css("display", "block");
    }
    export function hideMask() {
        $(".content").load("mine.html", function () {
            $(".workMail").css("display", "block");
            $(".mine_power").css("display", "none");
            $("#sitemsg").addClass("active");
            $("#power").removeClass("active");
        });
    }

   
}