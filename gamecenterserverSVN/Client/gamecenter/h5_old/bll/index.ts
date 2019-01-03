declare var wx, Swiper;
window.addEventListener("message", (e) => {
    if (!!e.data) {
        var para = new GAMECENTER.GSUSERLOGINREQ();
        para.loginid = e.data.loginid;
        para.pwd = e.data.pwd;
        GAMECENTER.gsUserLogin_old(para, resp => {
            var dat: GAMECENTER.GSUSERLOGINRESP = resp.data;
            GAMECENTER.userinfo = dat.userinfo;
            GAMECENTER.SaveUserInfo();
            parent.window.frames["rightFrame"].location.href = "http://5wanpk.com/h5_old"
        });
    }
})

$(document).ready(() => {
    if ((this.parent != this) && (window.parent.location.href.indexOf("gameCenter.html") >= 0) && !utils.isMobileBrowser()) {
        document.getElementById("content_in_iframe").style.height = "7.4rem";
    }
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
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
module INDEXPAGE_NEW {
    var rpImgList: HTMLDivElement = <any>document.getElementById("rpimglist");
    var guicon: HTMLImageElement = <any>document.getElementById("headimg");
    var guname: HTMLInputElement = <any>document.getElementById("nickname");
    var glv: HTMLInputElement = <any>document.getElementById("lv_level");
    var rpgame: HTMLDivElement;
    export function loadDefaultData(userinfo) {
        initUser(userinfo);
        ShowRecentPlay(userinfo);
        WXShare();
    }
    export function isUnreadMail() {

    }
    export function initUser(userinfo: GAMECENTER.GSUSERINFO) {
        guicon.src = userinfo.headico.replace("7035", "7031");
        guname.value = userinfo.nickname;
        var para: GAMECENTER.GSUSERLVREQ = new GAMECENTER.GSUSERLVREQ();
        para.userid = userinfo.sdkuserid;
        GAMECENTER.gsUserLv(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var res: GAMECENTER.GSUSERLVRESP = resp.data;
            var lv = res.gslv;
            if (lv != 0) {
                glv.textContent = "LV:";
                if (lv >= 1 && lv < 6) {//LV1-5
                    for (var i = lv; i >= 1; i--) {
                        var img: HTMLImageElement = <any>document.createElement("img");
                        img.src = "../style/img/index/LV_CU.gif";
                        glv.appendChild(img);
                    }
                } else if (lv >= 6 && lv < 11) {//LV6-10
                    for (var i = lv; i >= 6; i--) {
                        var img: HTMLImageElement = <any>document.createElement("img");
                        img.src = "../style/img/index/LV_AG.gif";
                        glv.appendChild(img);
                    }
                } else {
                    for (var i = lv; i >= 11; i--) {//LV11-15
                        var img: HTMLImageElement = <any>document.createElement("img");
                        img.src = "../style/img/index/LV_AU.gif";
                        glv.appendChild(img);
                    }
                }
            }
        });
    }
    export function ShowRecentPlay(userinfo: GAMECENTER.GSUSERINFO) {
        rpgame = <any>document.getElementById("swiper-wrapper");
        var para: H5LOGINFOEntity_NEW.GSUSERGETH5LOGLISTREQ = new H5LOGINFOEntity_NEW.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, resp => {//获取所有玩过的游戏列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var h5gameRPlist: GAMECENTER.H5APPINFO[] = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            for (var i = 0; i < h5gameRPlist.length; i++) {
                var item: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var appinfo: GAMECENTER.H5APPINFO = h5gameRPlist[i];
                (function fun(data: GAMECENTER.H5APPINFO) {
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(() => { window.parent.location.reload(); }, 500);
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
    //微信分享
    var data: GAMECENTER.OPENAPPRESP;
    export function WXShare() {
        GAMECENTER.openShare("99999", resp => {//9999临时数据，为了函数执行
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            data = resp.data;
            InitWX();
        });
        function InitWX() {
            var wxinit: GAMECENTER.WXCONFIG = {
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端utils.dialogBox出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxe983a05c52c5188f', // 必填，公众号的唯一标识
                timestamp: new Date().getTime().toString(), // 必填，生成签名的时间戳
                nonceStr: Math.floor(Math.random() * 100000000).toString(), // 必填，生成签名的随机串
                signature: '',// 必填，签名，见附录1
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };
            var parainit = new GAMECENTER.GETWXCONFIGSIGNREQ();
            parainit.data = wxinit;
            parainit.url = window.location.href;
            GAMECENTER.getWXConfigSign(parainit, resp => {
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
                        title: (!!data.sharetext) ? data.sharetext : data.appname, // 分享标题
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQQ({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQZone({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
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
}