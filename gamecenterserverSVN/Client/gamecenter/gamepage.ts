﻿    declare var wx,md5;
$(document).ready(() => {
    GAMEPAGE.WXShare();
    GAMEPAGE.getNextSession();
});
module GAMEPAGE {
    class ShareInfo {
        shareCode: string;
        shareUser: string;
    }
    //微信分享
    var data: GAMECENTER.OPENAPPRESP;
    var shareUser, shareCode;
    if (!!utils.getCookie("GSUSERINFO")) {
        shareUser = utils.getCookie("GSUSERINFO").sdkuserid;
        shareCode = md5(shareUser);
    }

    export function getNextSession() {
        var para_appid = "";
        var urlPara = window.location.href.split('?');
        var height = window.innerHeight;
        if (urlPara.length==3) {
            para_appid = urlPara[1].split('#')[1];
        } else if (urlPara.length == 2) {
            para_appid = urlPara[0].split('#')[1]
            if (utils.isMobileBrowser()) {
                if (!!utils.getCookie("GSUSERINFO")) {
                    utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                } else {
                    if (urlPara[1].indexOf("userInfo") >= 0) {
                        var userInfo = JSON.parse(decodeURIComponent(atob(decodeURIComponent(urlPara[1].split('=')[1]))));
                        GAMECENTER.getNextSession(userInfo.sdkuserid, (resp) => {
                            if (resp.errno != 0) {
                                utils.dialogBox(resp.message);
                                return;
                            }
                            userInfo.session = resp.data;
                            utils.setCookie("GSUSERINFO", userInfo);
                            utils.setStorage("session", "&session=" + resp.data, "sessionStorage");
                            window.location.reload();
                        });
                    }
                }
            }
        } else {
            para_appid = window.location.href.split('#')[1];
            if (!!utils.getCookie("GSUSERINFO")) {
                utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
            }
        }
        var session = utils.getStorage("session", "sessionStorage");
        var para_url = "http://5wanpk.com:7031/gsh5game?id=" + para_appid;
        var mainFrame = document.getElementById("mainFrame");
        mainFrame.setAttribute("height", height.toString());
        if (session != null) {
            window.frames["mainFrame"].location.href = para_url + session + "&5waniframe=" + encodeURIComponent(window.location.href);
        } else {
            window.frames["mainFrame"].location.href = para_url + "&5waniframe=" + encodeURIComponent(window.location.href);
        }
        utils.setCookie("5waniframe", window.location.href);
        var icourl = utils.g_serverurl + "gamecenter/h5game/ico/" + para_appid + ".png";
        $('#link_ico').attr('href', icourl);
        $("title").after('<link rel="icon" sizes="64x64" type="image/png" href="' + icourl + '">');
        $('#game_ico').attr('src', icourl);
        $('#game_ico2').attr('src', icourl);
        $('#game_ico3').attr('src', icourl);
        $('#game_ico4').attr('src', icourl);
        var rightFrame = document.getElementById('rightFrame');
        window.addEventListener("message", function (ev) {
            if (ev.data.type == "userinfo") {
                rightFrame["contentWindow"].postMessage(ev.data.data, "*");
            }
        });
    }

    export function WXShare() {
        var urlPara = window.location.href.split('?');
        var para_appid = "";
        var link = "http://5wanpk.com/gamecenter/gamepage.html";
        //if (!!!urlPara[2]) {
        //    if (!!urlPara[1]) {//有分享参数存在，统计分享
        //            para_appid = urlPara[0].split('#')[1];
        //            link = urlPara[0];
        //        if (urlPara[1].indexOf("shareCode") >= 0) {
        //            var para: GAMECENTER.GSSHAREGAMEREQ = new GAMECENTER.GSSHAREGAMEREQ();
        //            var shareInfo: ShareInfo = JSON.parse(utils.UrlPara2Json(urlPara[1]));
        //            para.appid = para_appid;
        //            para.shareuser = shareInfo.shareUser;
        //            para.sharecode = shareInfo.shareCode;
        //            GAMEPAGE.shareGame(para);
        //        }
        //    } else {
        //        para_appid = window.location.href.split('#')[1];
        //        link = window.location.href;
        //    }
        //} else {
        //    if (!!urlPara[2]) {//有分享参数存在，统计分享
        //            para_appid = urlPara[1].split('#')[1];
        //            link = urlPara[0] + "#" + para_appid;
        //        if (urlPara[2].indexOf("shareCode") >= 0) {
        //            var para: GAMECENTER.GSSHAREGAMEREQ = new GAMECENTER.GSSHAREGAMEREQ();
        //            var shareInfo: ShareInfo = JSON.parse(utils.UrlPara2Json(urlPara[2]));
        //            para.appid = para_appid;
        //            para.shareuser = shareInfo.shareUser;
        //            para.sharecode = shareInfo.shareCode;
        //            GAMEPAGE.shareGame(para);
        //        }
        //    } else {
        //        para_appid = window.location.href.split('#')[1];
        //        link = window.location.href;
        //    }
        //}
        if (urlPara.length == 3) {
            para_appid = urlPara[1].split('#')[1];
            link = link + "#" + para_appid;
            var para: GAMECENTER.GSSHAREGAMEREQ = new GAMECENTER.GSSHAREGAMEREQ();
            var shareInfo: ShareInfo = JSON.parse(utils.UrlPara2Json(urlPara[2]));
            para.appid = para_appid;
            para.shareuser = shareInfo.shareUser;
            para.sharecode = shareInfo.shareCode;
            GAMEPAGE.shareGame(para);
        } else if (urlPara.length == 2) {
            para_appid = urlPara[0].split('#')[1];
            link = link + "#" + para_appid;
            if (urlPara[1].indexOf("shareCode") >= 0) {
                var para: GAMECENTER.GSSHAREGAMEREQ = new GAMECENTER.GSSHAREGAMEREQ();
                var shareInfo2 = JSON.parse(utils.UrlPara2Json(urlPara[1]));
                para.appid = para_appid;
                para.shareuser = shareInfo2.shareUser;
                para.sharecode = shareInfo2.shareCode;
                GAMEPAGE.shareGame(para);
            }
        } else {
            para_appid = window.location.href.split('#')[1];
            link = window.location.href;
        } 
        GAMECENTER.openShare(para_appid, resp => {
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
            $('title').text(data.appname);
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
                        link: encodeURI(link + "?shareCode=" + shareCode + "&shareUser=" + shareUser), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: (!!data.sharetext) ? data.sharetext : data.appname, // 分享标题
                        link: encodeURI(link + "?shareCode=" + shareCode + "&shareUser=" + shareUser), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQQ({
                        title: (!!data.sharetext) ? data.sharetext : data.appname, // 分享标题
                        link: encodeURI(link + "?shareCode=" + shareCode + "&shareUser=" + shareUser), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: (!!data.sharetext) ? data.sharetext : data.appname, // 分享标题
                        link: encodeURI(link + "?shareCode=" + shareCode + "&shareUser=" + shareUser), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQZone({
                        title: (!!data.sharetext) ? data.sharetext : data.appname, // 分享标题
                        link: encodeURI(link + "?shareCode=" + shareCode + "&shareUser=" + shareUser), // 分享链接
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

    

    export function shareGame(para: GAMECENTER.GSSHAREGAMEREQ) {
        GAMECENTER.gsShareGame(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            console.log(resp.data);
        });
    }
}