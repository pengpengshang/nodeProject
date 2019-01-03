var _this = this;
window.addEventListener("message", function (e) {
    if (!!e.data) {
        var para = new GAMECENTER.GSUSERLOGINREQ();
        para.loginid = e.data.loginid;
        para.pwd = e.data.pwd;
        GAMECENTER.gsUserLogin_old(para, function (resp) {
            var dat = resp.data;
            GAMECENTER.userinfo = dat.userinfo;
            GAMECENTER.SaveUserInfo();
            parent.window.frames["rightFrame"].location.href = "http://5wanpk.com/h5_old";
        });
    }
});
$(document).ready(function () {
    if ((_this.parent != _this) && (window.parent.location.href.indexOf("gameCenter.html") >= 0) && !utils.isMobileBrowser()) {
        document.getElementById("content_in_iframe").style.height = "7.4rem";
    }
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "loginIndex.html";
            });
            return;
        }
        INDEXPAGE_NEW.loadDefaultData(userinfo);
        /*if (navigator.userAgent.indexOf("FIVEGAME") >= 0 && (this.parent == this)) {
            if (!!utils.getExpiresCookies("loginFlags")) {
                window.location.href = "../../gamepage.html#422";
                //window.location.href = "http://www.baidu.com/"
            } else {
                INDEXPAGE_NEW.loadDefaultData(userinfo);
            }
        } else {
            INDEXPAGE_NEW.loadDefaultData(userinfo);
        }*/
    });
});
var INDEXPAGE_NEW;
(function (INDEXPAGE_NEW) {
    var rpImgList = document.getElementById("rpimglist");
    var guicon = document.getElementById("headimg");
    var guname = document.getElementById("nickname");
    var glv = document.getElementById("lv_level");
    var rpgame;
    function loadDefaultData(userinfo) {
        initUser(userinfo);
        ShowRecentPlay(userinfo);
        WXShare();
    }
    INDEXPAGE_NEW.loadDefaultData = loadDefaultData;
    function isUnreadMail() {
    }
    INDEXPAGE_NEW.isUnreadMail = isUnreadMail;
    function initUser(userinfo) {
        guicon.src = userinfo.headico.replace("7035", "7031");
        guname.value = userinfo.nickname;
        var para = new GAMECENTER.GSUSERLVREQ();
        para.userid = userinfo.sdkuserid;
        GAMECENTER.gsUserLv(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var res = resp.data;
            var lv = res.gslv;
            if (lv != 0) {
                glv.textContent = "LV:";
                if (lv >= 1 && lv < 6) {
                    for (var i = lv; i >= 1; i--) {
                        var img = document.createElement("img");
                        img.src = "../style/img/index/LV_CU.gif";
                        glv.appendChild(img);
                    }
                }
                else if (lv >= 6 && lv < 11) {
                    for (var i = lv; i >= 6; i--) {
                        var img = document.createElement("img");
                        img.src = "../style/img/index/LV_AG.gif";
                        glv.appendChild(img);
                    }
                }
                else {
                    for (var i = lv; i >= 11; i--) {
                        var img = document.createElement("img");
                        img.src = "../style/img/index/LV_AU.gif";
                        glv.appendChild(img);
                    }
                }
            }
        });
    }
    INDEXPAGE_NEW.initUser = initUser;
    function ShowRecentPlay(userinfo) {
        rpgame = document.getElementById("swiper-wrapper");
        var para = new H5LOGINFOEntity_NEW.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var h5gameRPlist = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            for (var i = 0; i < h5gameRPlist.length; i++) {
                var item = document.createElement("div");
                var link = document.createElement("a");
                var img = document.createElement("img");
                var appinfo = h5gameRPlist[i];
                (function fun(data) {
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            }
                            else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        }
                        else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(function () { window.parent.location.reload(); }, 500);
                            }
                            else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(function () { window.parent.location.reload(); }, 500);
                            }
                        }
                    };
                })(appinfo);
                img.src = appinfo.ico;
                img.setAttribute("class", "gamePic");
                link.appendChild(img);
                item.setAttribute("class", "swiper-slide swiper-slide_wimg");
                item.appendChild(link);
                rpgame.appendChild(item);
            }
            new Swiper('#swiper-container-flex', {
                slidesPerView: 4,
                autoplay: 2000,
                grabCursor: true,
                autoplayDisableOnInteraction: false
            });
        });
    }
    INDEXPAGE_NEW.ShowRecentPlay = ShowRecentPlay;
    //微信分享
    var data;
    function WXShare() {
        GAMECENTER.openShare("99999", function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            data = resp.data;
            InitWX();
        });
        function InitWX() {
            var wxinit = {
                debug: false,
                appId: 'wxe983a05c52c5188f',
                timestamp: new Date().getTime().toString(),
                nonceStr: Math.floor(Math.random() * 100000000).toString(),
                signature: '',
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };
            var parainit = new GAMECENTER.GETWXCONFIGSIGNREQ();
            parainit.data = wxinit;
            parainit.url = window.location.href;
            GAMECENTER.getWXConfigSign(parainit, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                wxinit.signature = resp.data.sign;
                wx.config(wxinit);
                wx.ready(function () {
                    // utils.dialogBox("ready");
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    wx.onMenuShareTimeline({
                        title: (!!data.sharetext) ? data.sharetext : data.appname,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        type: '',
                        dataUrl: '',
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQQ({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQZone({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                });
            });
        }
    }
    INDEXPAGE_NEW.WXShare = WXShare;
})(INDEXPAGE_NEW || (INDEXPAGE_NEW = {}));
//# sourceMappingURL=index.js.map