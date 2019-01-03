$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "loginIndex.html";
            });
            return
        }
        WELFARE.loadDefaultData();
    })
});
module WELFARE {
    var gtul_zs: HTMLUListElement = <any>document.getElementById("gtul_zs");
    var gtitem_zs: HTMLLIElement = <any>gtul_zs.firstElementChild;
    var gtitems_zs: HTMLLIElement[] = [];
    var gtul_hh: HTMLUListElement = <any>document.getElementById("gtul_hh");
    var gtitem_hh: HTMLLIElement = <any>gtul_hh.firstElementChild;
    var gtitems_hh: HTMLLIElement[] = [];
    var gtul_zz: HTMLUListElement = <any>document.getElementById("gtul_zz");
    var gtitem_zz: HTMLLIElement = <any>gtul_zz.firstElementChild;
    var gtitems_zz: HTMLLIElement[] = [];
    export function loadDefaultData() {
        initEvent();
        initVIPQQ();
        loadWelfareGift();
        loadGameList();
        loadWelfareAccount();
    }
    export function loadWelfareGift() {
        var today = new Date();
        gtitem_zs.style.display = "none";
        gtitem_hh.style.display = "none";
        gtitem_zz.style.display = "none";
        var para: GAMECENTER.GETALLWELFTARETYPEREQ = new GAMECENTER.GETALLWELFTARETYPEREQ();
        para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
        GAMECENTER.GetAllWelftareType(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var zf_giftlist: GAMECENTER.GETALLWELFTARETYPEINFO[] = resp.data.zf_giftlist;
            var hh_giftlist: GAMECENTER.GETALLWELFTARETYPEINFO[] = resp.data.hh_giftlist;
            var zz_giftlist: GAMECENTER.GETALLWELFTARETYPEINFO[] = resp.data.zz_giftlist;
            for (var i = 0; i < gtitems_zs.length; i++) {//元素清除操作
                gtul_zs.removeChild(gtitems_zs[i]);
            }
            gtitems_zs.splice(0);
            for (var i = 0; i < gtitems_hh.length; i++) {//元素清除操作
                gtul_hh.removeChild(gtitems_hh[i]);
            }
            gtitems_hh.splice(0);
            for (var i = 0; i < gtitems_zz.length; i++) {//元素清除操作
                gtul_zz.removeChild(gtitems_zz[i]);
            }
            gtitems_zz.splice(0);
            for (var i = 0; zf_giftlist != null && i < zf_giftlist.length; i++) {//专属礼包
                var items: HTMLLIElement = <any>gtitem_zs.cloneNode(true);
                var giftinfo: GAMECENTER.GETALLWELFTARETYPEINFO = zf_giftlist[i];
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
                gtul_zs.parentElement.querySelector("#fr").setAttribute("href", "morewelfare.html?typenum=" + giftinfo.type);
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
                    $(items).find("#gameico").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
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
                gtul_zs.appendChild(items);
                gtitems_zs.push(items);
            }
            for (var i = 0; hh_giftlist != null && i < hh_giftlist.length; i++) {//豪华礼包
                var items: HTMLLIElement = <any>gtitem_hh.cloneNode(true);
                var giftinfo: GAMECENTER.GETALLWELFTARETYPEINFO = hh_giftlist[i];
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
                gtul_hh.parentElement.querySelector("#fr").setAttribute("href", "morewelfare.html?typenum=" + giftinfo.type);
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
                    $(items).find("#gameico").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
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
                gtul_hh.appendChild(items);
                gtitems_hh.push(items);
            }
            for (var i = 0; zz_giftlist != null && i < zz_giftlist.length; i++) {//至尊礼包
                var items: HTMLLIElement = <any>gtitem_zz.cloneNode(true);
                var giftinfo: GAMECENTER.GETALLWELFTARETYPEINFO = zz_giftlist[i];
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
                gtul_zz.parentElement.querySelector("#fr").setAttribute("href", "morewelfare.html?typenum=" + giftinfo.type);
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
                    $(items).find("#gameico").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
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
                gtul_zz.appendChild(items);
                gtitems_zz.push(items);
            }
        })
    }
    var gaul: HTMLUListElement = <any>document.getElementById("gaul");
    var gaitem_type1: HTMLLIElement = <any>gaul.children[0];
    var gaitems_type1: HTMLLIElement[] = [];
    var gaitem_type2: HTMLLIElement = <any>gaul.children[1];
    var gaitems_type2: HTMLLIElement[] = [];
    export function loadWelfareAccount() {//加载高级账号列表
        gaitem_type1.style.display = "none";
        gaitem_type2.style.display = "none";
        var para: GAMECENTER.GETALLACCOUNTINFOREQ = new GAMECENTER.GETALLACCOUNTINFOREQ();
        GAMECENTER.gsGetAllAcount(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < gaitems_type1.length; i++) {
                gaul.removeChild(gaitems_type1[i]);
            }
            gaitems_type1.splice(0);
            for (var i = 0; i < gaitems_type2.length; i++) {
                gaul.removeChild(gaitems_type2[i]);
            }
            gaitems_type2.splice(0);
            var dat: GAMECENTER.GETALLACCOUNTINFO[] = resp.data;
            for (var i = 0; dat != null && i < dat.length; i++) {
                var accountInfo: GAMECENTER.GETALLACCOUNTINFO = dat[i];
                var items: HTMLLIElement = null;
                if (accountInfo.type == 1) {
                    items = <any>gaitem_type1.cloneNode(true);
                    items.id = "accountList" + i;
                    var nameandtitle = "[" + accountInfo.name + "]" + accountInfo.title;
                    $(items).find("#SA_content_t").text(nameandtitle);
                    $(items).find("#condition").text(accountInfo.condition);
                    $(items).find("#pricelow").text(accountInfo.pricelow);
                    $(items).find("#pricehigh").text(accountInfo.pricehigh);
                    (function fun(data: GAMECENTER.GETALLACCOUNTINFO) {
                        $(items).find("#SA_img").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
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
                    })(accountInfo)
                    GAMECENTER.gsGetAllAcountDetail({ gatid: accountInfo.id, loginid: utils.getCookie("GSUSERINFO").sdkloginid, listid: items.id }, resp => {
                        if (resp.errno != 0) {
                            utils.dialogBox(resp.message);
                            return;
                        }
                        var dat: GAMECENTER.GETALLACCOUNTDETAIL[] = resp.data.alist;
                        var itemId = document.getElementById(resp.data.listid);
                        var atable: HTMLTableElement = <any>itemId.querySelector("#accountItems");
                        var atableItem: HTMLTableRowElement = <any>itemId.querySelector("#accountItem");
                        var atableItems: HTMLTableRowElement[] = [];
                        atableItem.style.display = "none";
                        for (var i = 0; i < atableItems.length; i++) {
                            atable.removeChild(atableItems[i]);
                        }
                        atableItems.splice(0);
                        for (var j = 0; dat != null && j < dat.length; j++) {
                            var loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                            var userid = utils.getCookie("GSUSERINFO").sdkuserid;
                            var acdetail: GAMECENTER.GETALLACCOUNTDETAIL = dat[j];
                            var item: HTMLTableRowElement = <any>atableItem.cloneNode(true);
                            item.style.display = "";
                            if (acdetail.loginid != null) {//当前账号领取礼包情况
                                $(item).find("#SA_btn").css("background", "#9B9B9B").text("已申领");
                            }
                            $(item).find("#title").text(acdetail.title);
                            $(item).find("#condition").text(acdetail.condition);
                            $(item).find("#price").text(acdetail.price);
                            $(item).find("#surplu").text(acdetail.surplu);
                            (function fun(data: GAMECENTER.GETALLACCOUNTDETAIL) {
                                $(item).find("#SA_btn").click(function () {
                                    var getFlag = $(this).text();
                                    if ("已申领" != getFlag) {
                                        getAccount(data.id, loginid, userid, data.name, data.title, data.price);
                                    }
                                });
                            })(acdetail);
                            atable.appendChild(item);
                        }
                    });
                    gaitems_type1.push(items);
                } else if (accountInfo.type == 2) {
                    items = <any>gaitem_type2.cloneNode(true);
                    items.id = "accountList" + i;
                    var nameandtitle = "[" + accountInfo.name + "]" + accountInfo.title;
                    $(items).find("#SA_content_t").text(nameandtitle);
                    $(items).find("#condition").text(accountInfo.condition);
                    $(items).find("#pricelow").text(accountInfo.pricelow);
                    $(items).find("#pricehigh").text(accountInfo.pricehigh);
                    (function fun(data: GAMECENTER.GETALLACCOUNTINFO) {
                        $(items).find("#SA_img").attr("src", data.ico + "?" + Math.random()).attr("title", data.name).click(function () {
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
                        $(items).find("#SA_btn").css("color", "#888").attr("href", "http://wpa.qq.com/msgrd?v=3&uin=3351737161&site=qq&menu=yes").attr("target", "_blank");
                    })(accountInfo)
                    gaitems_type2.push(items);
                }
                items.style.display = "";
                gaul.appendChild(items);
            }
            $(".js_category").on("click", function () {
                var $this = $(this),
                    $inner = $this.next('.js_categoryInner'),
                    $parent = $(this).parent('li');
                var innerH = $inner.data('height');

                if (!innerH) {
                    $inner.css('height', 'auto');
                    innerH = $inner.height();
                    $inner.removeAttr('style');
                    $inner.data('height', innerH);
                }
                if ($parent.hasClass('js_show')) {
                    $parent.removeClass('js_show');
                } else {
                    $parent.addClass('js_show');
                }
                $this.children(".right_top").toggleClass("toggle");
            })
        });
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
                utils.dialogBox(resp.message);
                return;
            }
            WELFARE.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            } else {
                $("#copyCode").text("来晚了,请等待下次发放");
                $("#copyto").css("display", "none");
            }
            $("#close").click(function () {
                WELFARE.hideMask();
                if ($("#copyCode").text() != "来晚了,请等待下次发放") {
                    doc.css("background", "#E55659").text("查看");
                }
            });
            $("#start").click(function () {
                WELFARE.hideMask();
                if (utils.getCookie("GSUSERINFO")) {
                    utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                }
                if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                    if (utils.isMobileBrowser()) {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
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

    export function getAccount(aid, loginid, userid, gname, detail, price) {//申请高级账号
        $("#server").val(null);
        $("#rolename").val(null);
        var para: GAMECENTER.GSAPPLYACCOUNTREQ = new GAMECENTER.GSAPPLYACCOUNTREQ();
        para.aid = aid;
        para.loginid = loginid;
        para.userid = userid;
        para.price = price;
        para.gname = gname;
        para.detail = detail;
        WELFARE.showMask2();
        $("#cancel").attr("onclick", "WELFARE.hideMask2();");
        $("#commit").attr("onclick", 'WELFARE.hideMask2();WELFARE.gsApplyAc(' + JSON.stringify(para) + ');') //如果不使用动态标签添加的形式，导致冒泡行为,且暂时解决不了
    }

    export function gsApplyAc(para) {//申请高级账号请求
        para.server = $("#server").val();
        para.rolename = $("#rolename").val()
        GAMECENTER.gsApplyAccount(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            utils.dialogBox("申领成功", () => {
                $(".content").load("welfare.html");
            });
        });
    }

    export function loadGameList() {//加载游戏列表
        var selh5game: HTMLSelectElement = <any>document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            var h5applist: GAMECENTER.H5APPINFO[] = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
    }

    export function initEvent() {
        var _option;
        $(".VIPCustome").find("li").eq(0).click(function () {
            GAMECENTER.gsCheckUserLevel({ userid: utils.getCookie("GSUSERINFO").sdkuserid, lv: 4 }, (resp) => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                $(".u1_person").show();
                $(".btn-default").click(function () {
                    $(".u1_person").hide();
                })
            });
        });
        $(".VIPCustome").find("li").eq(1).click(function () {
            GAMECENTER.gsCheckUserLevel({ userid: utils.getCookie("GSUSERINFO").sdkuserid, lv: 5 }, (resp) => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                _option = '<option value="1">充值未到账</option>';
                _option += '<option value="1">其他问题</option>';
                $("#problemlist").empty().append(_option);
                $(".u1").show();
            });
        });
        $(".VIPCustome").find("li").eq(2).click(function () {
            GAMECENTER.gsCheckUserLevel({ userid: utils.getCookie("GSUSERINFO").sdkuserid, lv: 5 }, (resp) => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                _option = '<option value="2">道具丢失</option>';
                _option += '<option value="2">其他问题</option>';
                $("#problemlist").empty().append(_option);
                $(".u1").show();
            });
        })
        $(".VIPCustome").find("li").eq(3).click(function () {
            GAMECENTER.gsCheckUserLevel({ userid: utils.getCookie("GSUSERINFO").sdkuserid, lv: 5 }, (resp) => {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                _option = '<option value="3">账号丢失</option>';
                _option += '<option value="3">其他问题</option>';
                $("#problemlist").empty().append(_option);
                $(".u1").show();
            });
        })
        $(".pull-left").click(function () {
            $(".u1").hide();
        })
    }

    export function initVIPQQ() {//加载VIPQQ列表
        var vipqqlist: HTMLUListElement = <any>document.getElementById("vipqqlist");
        var vipqq: HTMLLIElement = <any>vipqqlist.firstElementChild;
        var vipqqs: HTMLLIElement[] = [];
        vipqq.style.display = "none";
        GAMECENTER.gsGetVipQQ({ userid: utils.getCookie("GSUSERINFO").sdkuserid }, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < vipqqs.length; i++) {//元素清除操作
                vipqqlist.removeChild(vipqqs[i]);
            }
            vipqqs.splice(0);
            var vipqqInfos: GAMECENTER.GSVIPQQINFO[] = resp.data;
            for (var i = 0; vipqqInfos != null && i < vipqqInfos.length; i++) {
                var items: HTMLLIElement = <any>vipqq.cloneNode(true);
                var vipqqinfo: GAMECENTER.GSVIPQQINFO = vipqqInfos[i];
                var qqnumber = "http://wpa.qq.com/msgrd?v=3&amp;uin=" + vipqqinfo.qqnum + "&amp;site=qq&amp;menu=yes";
                $(items).find("#qqname").text(vipqqinfo.qqname);
                $(items).find("#VIPQQ").attr("href", qqnumber);
                items.style.display = "";
                vipqqlist.appendChild(items);
                vipqqs.push(items);
            }
        });
    }

    export function sendProblem() {//提交问题
        var gamelist = $("#gamelist option:selected");
        var serverNameE: HTMLInputElement = <any>document.getElementById("serverName");
        var problemlist = $("#problemlist option:selected");
        var detailE: HTMLTextAreaElement = <any>document.getElementById("detail");
        var gname = gamelist.text();
        var problem = problemlist.text();
        var problemType = problemlist.val();
        var serverName = serverNameE.value;
        var detail = detailE.value;
        var para: GAMECENTER.GSSENDPROBLEMREQ = new GAMECENTER.GSSENDPROBLEMREQ();
        para.userid = utils.getCookie("GSUSERINFO").sdkuserid;
        para.detail = detail;
        para.gname = gname;
        para.server = serverName;
        para.title = problem;
        para.type = parseInt(problemType);
        GAMECENTER.gsSendProblem(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            utils.dialogBox("提交成功", () => {
                detailE.value = "";
                serverNameE.value = "";
                $("#problem").hide();
            });
        });
    }

    export function showMask() {//显示领取页面
        $("#confirmDialog").css("display", "block");
    }
    export function hideMask() {//隐藏领取页面
        $("#confirmDialog").css("display", "none");
    }
    export function showMask2() {//显示领取高级账号页面
        $("#confirmDialog2").css("display", "block");
    }
    export function hideMask2() {//隐藏领取高级账号页面
        $("#confirmDialog2").css("display", "none");
    }
}