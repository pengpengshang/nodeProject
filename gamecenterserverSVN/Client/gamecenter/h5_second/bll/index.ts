declare var wx;
$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if ((this.parent == this) || (utils.isMobileBrowser())) {
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
module INDEXPAGE {//主页模块
    var rpImgList: HTMLDivElement = <any>document.getElementById("rpimglist");
    var guicon: HTMLImageElement = <any>document.getElementById("guicon");
    var guname: HTMLInputElement = <any>document.getElementById("loginname");
    var head = $("#head");
    export function initUser(userinfo: GAMECENTER.GSUSERINFO) {
        guicon.src = userinfo.headico;
        guname.setAttribute("value", userinfo.nickname);
        guname.style.width = utils.getBytesLength(guname.value) * 23 + "px"//根据文本内容设置文本框大小，每个字符20像素
    }
    export function ShowRecentPlay(userinfo: GAMECENTER.GSUSERINFO) {//显示最近玩过的游戏
        rpImgList.innerHTML = "";//默认将内容置为空
        $("#Modify").css("display", "inline-block");
        var para: H5LOGINFOEntity.GSUSERGETH5LOGLISTREQ = new H5LOGINFOEntity.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, resp => {//获取所有玩过的游戏列表
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var h5gameRPlist: GAMECENTER.H5APPINFO[] = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            if (h5gameRPlist == null) {//数据为空，不显数据
                rpImgList.innerHTML = "";
            }
            for (var i = 0; h5gameRPlist != null && i < h5gameRPlist.length; i++) {
                var rpImg: HTMLImageElement = document.createElement("img");
                rpImg.setAttribute("style", "width:80px;height:80px;padding-left:15px;border-radius:10px;");
                rpImg.setAttribute("src", h5gameRPlist[i].ico);
                rpImg.setAttribute("onclick", "INDEXPAGE.h5GameIn('" + h5gameRPlist[i].id + "')");
                if (i == 0) {//将第一个元素属性设置激活状态，以便可以滚动
                    rpImg.setAttribute("class", "mui-active");
                }
                rpImgList.appendChild(rpImg);
            }
        })
    }

    export function switchAccount() {//切换用户，返回登入页
        $("#switchaccount").bind("click", function () {
            GAMECENTER.userinfo = null;
            GAMECENTER.SaveUserInfo();
            window.location.href = "loginIndex.html";
        });
    }

    export function updateNickName() {//修改昵称
        var para = new GAMECENTER.GSUSERSETNICKNAMEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.nickname = guname.value;
        if (!para.nickname) {
            alert("请输入昵称！");
            return;
        }
        GAMECENTER.gsUserSetNickName(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            guname.setAttribute("value", para.nickname);//设置昵称框修改数据
            guname.style.width = utils.getBytesLength(guname.value) * 23 + "px"//根据文本内容设置文本框大小，每个字符20像素
        });
    }

    var headfile: HTMLInputElement = <any>document.getElementById("headfile");
    export function onHeadClick() {//头像点击
        if (!GAMECENTER.userinfo) return;
        headfile.click();
    }
    export function onHeadSel() {//修改头像
        var head = $("#head");
        var file;
        if (headfile.files.length > 0) file = headfile.files[0];
        else {
            return;
        }
        GAMECENTER.gsUserSetHeadIco({ mysession: GAMECENTER.userinfo.session }, file, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var ret: GAMECENTER.GSUSERSETHEADICORESP = resp.data;
            GAMECENTER.userinfo.headico = ret.headico;
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
            head.css("display", "none");
            document.getElementById('fade').style.display = 'none';

        });
    }

    export function h5GameIn(id) {//点击进入h5游戏
        if (GAMECENTER.userinfo) {
            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
        }
        window.location.href = "../../gamepage.html#" + id;
    }

    export function loaddefImgs() {//加载默认头像列表
        var imgList: string[] = [];
        var system_headshot = $("#system_headshot");
        GAMECENTER.getdefaultImgs(function (resp) {
            if (resp.errno != 0) {
                alert("数据加载失败，请刷新重试");
                return;
            }
            var defimgs = utils.getStorage("defImgs", "localStorage");
            if (defimgs == null) {
                utils.setStorage("defImgs", resp.data, "localStorage");
                imgList = resp.data;//从服务器读数据
            } else {
                imgList = defimgs;//从本地加载数据
            }
            for (var i = 0; i < imgList.length; i++) {
                var imgPath: string = imgList[i];
                var imgItem: HTMLLIElement = <any>document.createElement("li");
                var img: HTMLImageElement = document.createElement("img");
                img.src = imgPath;
                imgItem.appendChild(img);
                system_headshot.append(imgItem);
            }
            var childs = $('#system_headshot').children();
            childs.click(function () {//选定图片
                var path = $(this).children().attr("src");
                $(this).addClass('active').siblings().removeAttr('class');
                document.getElementById("headshoty").onclick = function () {
                    onHeadSel2(path);
                    head.css("display", "none");
                    document.getElementById('fade').style.display = 'none';
                }
            })
        });
    }

    export function onHeadSel2(imgPath) {//修改头像
        GAMECENTER.gsUserSetHeadIco2({ mysession: GAMECENTER.userinfo.session, path: imgPath }, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var ret: GAMECENTER.GSUSERSETHEADICORESP = resp.data;
            GAMECENTER.userinfo.headico = ret.headico;
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
            head.css("display", "none");
            document.getElementById('fade').style.display = 'none';
        });
    }

    //微信分享
    var data: GAMECENTER.OPENAPPRESP;
    export function WXShare() {
        GAMECENTER.openShare("99999", resp => {//9999临时数据，为了函数执行
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            data = resp.data;
            InitWX();
        });
        function InitWX() {
            var wxinit: GAMECENTER.WXCONFIG = {
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
                    alert(resp.message);
                    return;
                }
                wxinit.signature = resp.data.sign;
                wx.config(wxinit);
                wx.ready(function () {
                    //					alert("ready");
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    wx.onMenuShareTimeline({
                        title: (!!data.sharetext) ? data.sharetext : data.appname, // 分享标题
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
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
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
                        }
                    });
                    wx.onMenuShareQQ({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            alert("分享成功");
                        },
                        cancel: function () {
                            alert("分享取消");
                        }
                    });
                    wx.onMenuShareQZone({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
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
    //export function chooseImg() {
    //    wx.chooseImage({
    //        count: 1, // 默认9
    //        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //        success: function (res) {
    //            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    //        }
    //    });
    //}
    //export function qrcode() {
    //    wx.scanQRCode({
    //        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
    //        success: function (res) {
    //            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
    //            alert(result);
    //        }
    //    });
    //}
}