var _this = this;
$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if ((_this.parent == _this) || (utils.isMobileBrowser())) {
            if (userinfo == null || userinfo == undefined) {
                //alert("用户信息读取失败，请重新登入");
                //window.location.href = "login_after.html?id=5";
                return;
            }
            INDEXPAGE.initUser(userinfo);
            INDEXPAGE.ShowRecentPlay(userinfo);
            INDEXPAGE.switchAccount();
            INDEXPAGE.loaddefImgs();
            INDEXPAGE.WXShare();
        }
        INDEXPAGE.loaddefImgs();
    });
});
var INDEXPAGE;
(function (INDEXPAGE) {
    var rpImgList = document.getElementById("rpimglist");
    var guicon = document.getElementById("guicon");
    var guname = document.getElementById("loginname");
    var head = $("#head");
    function initUser(userinfo) {
        guicon.src = userinfo.headico;
        guname.setAttribute("value", userinfo.nickname);
        guname.style.width = utils.getBytesLength(guname.value) * 23 + "px"; //根据文本内容设置文本框大小，每个字符20像素
    }
    INDEXPAGE.initUser = initUser;
    function ShowRecentPlay(userinfo) {
        rpImgList.innerHTML = ""; //默认将内容置为空
        $("#Modify").css("display", "inline-block");
        var para = new H5LOGINFOEntity.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var h5gameRPlist = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            if (h5gameRPlist == null) {
                rpImgList.innerHTML = "";
            }
            for (var i = 0; h5gameRPlist != null && i < h5gameRPlist.length; i++) {
                var rpImg = document.createElement("img");
                rpImg.setAttribute("style", "width:80px;height:80px;padding-left:15px;border-radius:10px;");
                rpImg.setAttribute("src", h5gameRPlist[i].ico);
                rpImg.setAttribute("onclick", "INDEXPAGE.h5GameIn('" + h5gameRPlist[i].id + "')");
                if (i == 0) {
                    rpImg.setAttribute("class", "mui-active");
                }
                rpImgList.appendChild(rpImg);
            }
        });
    }
    INDEXPAGE.ShowRecentPlay = ShowRecentPlay;
    function switchAccount() {
        $("#switchaccount").bind("click", function () {
            GAMECENTER.userinfo = null;
            GAMECENTER.SaveUserInfo();
            window.location.href = "loginIndex.html";
        });
    }
    INDEXPAGE.switchAccount = switchAccount;
    function updateNickName() {
        var para = new GAMECENTER.GSUSERSETNICKNAMEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.nickname = guname.value;
        if (!para.nickname) {
            alert("请输入昵称！");
            return;
        }
        GAMECENTER.gsUserSetNickName(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            guname.setAttribute("value", para.nickname); //设置昵称框修改数据
            guname.style.width = utils.getBytesLength(guname.value) * 23 + "px"; //根据文本内容设置文本框大小，每个字符20像素
        });
    }
    INDEXPAGE.updateNickName = updateNickName;
    var headfile = document.getElementById("headfile");
    function onHeadClick() {
        if (!GAMECENTER.userinfo)
            return;
        headfile.click();
    }
    INDEXPAGE.onHeadClick = onHeadClick;
    function onHeadSel() {
        var head = $("#head");
        var file;
        if (headfile.files.length > 0)
            file = headfile.files[0];
        else {
            return;
        }
        GAMECENTER.gsUserSetHeadIco({ mysession: GAMECENTER.userinfo.session }, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var ret = resp.data;
            GAMECENTER.userinfo.headico = ret.headico;
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
            head.css("display", "none");
            document.getElementById('fade').style.display = 'none';
        });
    }
    INDEXPAGE.onHeadSel = onHeadSel;
    function h5GameIn(id) {
        if (GAMECENTER.userinfo) {
            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
        }
        window.location.href = "../../gamepage.html#" + id;
    }
    INDEXPAGE.h5GameIn = h5GameIn;
    function loaddefImgs() {
        var imgList = [];
        var system_headshot = $("#system_headshot");
        GAMECENTER.getdefaultImgs(function (resp) {
            if (resp.errno != 0) {
                alert("数据加载失败，请刷新重试");
                return;
            }
            var defimgs = utils.getStorage("defImgs", "localStorage");
            if (defimgs == null) {
                utils.setStorage("defImgs", resp.data, "localStorage");
                imgList = resp.data; //从服务器读数据
            }
            else {
                imgList = defimgs; //从本地加载数据
            }
            for (var i = 0; i < imgList.length; i++) {
                var imgPath = imgList[i];
                var imgItem = document.createElement("li");
                var img = document.createElement("img");
                img.src = imgPath;
                imgItem.appendChild(img);
                system_headshot.append(imgItem);
            }
            var childs = $('#system_headshot').children();
            childs.click(function () {
                var path = $(this).children().attr("src");
                $(this).addClass('active').siblings().removeAttr('class');
                document.getElementById("headshoty").onclick = function () {
                    onHeadSel2(path);
                    head.css("display", "none");
                    document.getElementById('fade').style.display = 'none';
                };
            });
        });
    }
    INDEXPAGE.loaddefImgs = loaddefImgs;
    function onHeadSel2(imgPath) {
        GAMECENTER.gsUserSetHeadIco2({ mysession: GAMECENTER.userinfo.session, path: imgPath }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var ret = resp.data;
            GAMECENTER.userinfo.headico = ret.headico;
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
            head.css("display", "none");
            document.getElementById('fade').style.display = 'none';
        });
    }
    INDEXPAGE.onHeadSel2 = onHeadSel2;
    //微信分享
    var data;
    function WXShare() {
        GAMECENTER.openShare("99999", function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
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
                    alert(resp.message);
                    return;
                }
                wxinit.signature = resp.data.sign;
                wx.config(wxinit);
                wx.ready(function () {
                    //					alert("ready");
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    wx.onMenuShareTimeline({
                        title: (!!data.sharetext) ? data.sharetext : data.appname,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
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
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
                        }
                    });
                    wx.onMenuShareQQ({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
                        }
                    });
                    wx.onMenuShareQZone({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
                        }
                    });
                });
            });
        }
    }
    INDEXPAGE.WXShare = WXShare;
})(INDEXPAGE || (INDEXPAGE = {}));
//# sourceMappingURL=index.js.map