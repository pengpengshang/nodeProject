$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "loginIndex.html";
            });
            return;
        }
        PERSONALINFO_NEW.initUser(userinfo);
        PERSONALINFO_NEW.loaddefImgs();
    });
});
var PERSONALINFO_NEW;
(function (PERSONALINFO_NEW) {
    var guid = document.getElementById("guid");
    var guicon = document.getElementById("guicon");
    var guname = document.getElementById("nickname");
    var PI_info = document.getElementById("PI_info");
    var gcity = document.getElementById("cityChoose");
    var bindPhoneStatus = document.getElementById("bindPhoneStatus");
    var bindMailStatus = document.getElementById("bindMailStatus");
    function initUser(userinfo) {
        guicon.src = userinfo.headico; //头像
        guname.textContent = userinfo.nickname; //昵称
        guid.textContent = userinfo.sdkuserid.toString(); //用户号
        if (userinfo.address == "" || userinfo.address == null) {
            gcity.textContent = "未填写";
        }
        else {
            gcity.textContent = userinfo.address;
        }
        var para = new GAMECENTER.GSUSERLVREQ();
        para.userid = userinfo.sdkuserid;
        GAMECENTER.gsUserLv(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var res = resp.data;
            var lv = res.gslv;
            if (lv >= 1 && lv < 6) {
                for (var i = lv; i >= 1; i--) {
                    var img = document.createElement("img");
                    img.src = "../style/img/index/LV_CU.gif";
                    PI_info.appendChild(img);
                }
            }
            else if (lv >= 6 && lv < 11) {
                for (var i = lv; i >= 6; i--) {
                    var img = document.createElement("img");
                    img.src = "../style/img/index/LV_AG.gif";
                    PI_info.appendChild(img);
                }
            }
            else {
                for (var i = lv; i >= 11; i--) {
                    var img = document.createElement("img");
                    img.src = "../style/img/index/LV_AU.gif";
                    PI_info.appendChild(img);
                }
            }
        });
        if (!userinfo.phone) {
            bindPhoneStatus.textContent = "未绑定";
            bindPhoneStatus.setAttribute("href", "modifyMess.html#/modifyPhone");
        }
        else {
            bindPhoneStatus.textContent = "更换";
            bindPhoneStatus.setAttribute("href", "modifyMess.html#/phoneBind");
        }
        if (!userinfo.email) {
            bindMailStatus.textContent = "未绑定";
            bindMailStatus.setAttribute("href", "modifyMess.html#/modifymail");
        }
        else {
            bindMailStatus.textContent = "更换";
            bindMailStatus.setAttribute("href", "modifyMess.html#/mailBind");
        }
    }
    PERSONALINFO_NEW.initUser = initUser;
    function switchAccount() {
        GAMECENTER.userinfo = null;
        GAMECENTER.SaveUserInfo();
        utils.setCookie("userinfo", null);
        window.location.href = "loginIndex.html";
    }
    PERSONALINFO_NEW.switchAccount = switchAccount;
    function setCity(city) {
        var para = new GAMECENTER.GSSETCITYREQ();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.city = city;
        para.mysession = GAMECENTER.userinfo.session;
        GAMECENTER.gsSetCity(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
        });
    }
    PERSONALINFO_NEW.setCity = setCity;
    function loaddefImgs() {
        var imgList = [];
        var system_headshot = $("#system_headshot");
        GAMECENTER.getdefaultImgs(function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
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
            childs.click(function (e) {
                e.stopPropagation();
                var path = $(this).children().attr("src");
                $(this).find("img").addClass('active');
                $(this).siblings().find("img").removeAttr('class');
                document.getElementById("confirm").onclick = function () {
                    onHeadSel2(path);
                };
            });
        });
    }
    PERSONALINFO_NEW.loaddefImgs = loaddefImgs;
    var headfile = document.getElementById("modifyhead");
    function onHeadSel() {
        var file;
        if (headfile.files.length > 0)
            file = headfile.files[0];
        else {
            return;
        }
        GAMECENTER.gsUserSetHeadIco({ mysession: GAMECENTER.userinfo.session }, file, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ret = resp.data;
            GAMECENTER.userinfo.headico = ret.headico;
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
        });
    }
    PERSONALINFO_NEW.onHeadSel = onHeadSel;
    function onHeadSel2(imgPath) {
        GAMECENTER.gsUserSetHeadIco2({ mysession: GAMECENTER.userinfo.session, path: imgPath }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ret = resp.data;
            GAMECENTER.userinfo.headico = ret.headico;
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
        });
    }
    PERSONALINFO_NEW.onHeadSel2 = onHeadSel2;
    function show(show_div) {
        $("#" + show_div).show();
    }
    PERSONALINFO_NEW.show = show;
    function close(close_div) {
        $("#" + close_div).hide();
    }
    PERSONALINFO_NEW.close = close;
})(PERSONALINFO_NEW || (PERSONALINFO_NEW = {}));
//# sourceMappingURL=personalInfo.js.map