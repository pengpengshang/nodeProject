$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
        PERSONINFO_SECOND.loadPersoninfo(userinfo);
        PERSONINFO_SECOND.loaddefImgs();
    });
});
var PERSONINFO_SECOND;
(function (PERSONINFO_SECOND) {
    function loadPersoninfo(userinfo) {
        $("#nickname").val(userinfo.nickname);
        $("#guicon").attr("src", userinfo.headico);
        if (userinfo.sex == 1) {
            $("#nan").attr("checked", "checked");
        }
        else {
            $("#nv").attr("checked", "checked");
        }
        if (!userinfo.address) {
            $("#cityChoose").text("未填写");
        }
        else {
            $("#cityChoose").text(userinfo.address);
        }
        $(".fill_phone").click(function () {
            if (!userinfo.phone) {
                window.location.href = 'fillInfo.html#/modifyPhone';
            }
            else {
                window.location.href = 'fillInfo.html#/phoneBind';
            }
        });
        $(".fill_email").click(function () {
            if (!userinfo.email) {
                window.location.href = 'fillInfo.html#/modifymail';
            }
            else {
                window.location.href = 'fillInfo.html#/mailBind';
            }
        });
    }
    PERSONINFO_SECOND.loadPersoninfo = loadPersoninfo;
    function updateNickName() {
        var guname = document.getElementById("nickname");
        var para = new GAMECENTER.GSUSERSETNICKNAMEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.nickname = guname.value;
        if (!para.nickname) {
            alert("请输入昵称！");
            return;
        }
        if (para.nickname.length > 10) {
            utils.dialogBox("昵称限制10字符以内！");
            return;
        }
        else {
            GAMECENTER.gsUserSetNickName(para, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                $("#nickname").val(para.nickname);
            });
        }
    }
    PERSONINFO_SECOND.updateNickName = updateNickName;
    function changeSex(sex) {
        var para = new GAMECENTER.CHANGESEXREQ();
        para.sex = sex;
        para.userid = GAMECENTER.userinfo.sdkuserid;
        para.mysession = GAMECENTER.userinfo.session;
        GAMECENTER.changeSex(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            if (para.sex == 1) {
                $("#nan").attr("checked", "checked");
            }
            else {
                $("#nv").attr("checked", "checked");
            }
        });
    }
    PERSONINFO_SECOND.changeSex = changeSex;
    function loaddefImgs() {
        var imgList = [];
        var system_headshot = $("#system_headshot");
        GAMECENTER.getdefaultImgs_second(function (resp) {
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
    PERSONINFO_SECOND.loaddefImgs = loaddefImgs;
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
            //GAMECENTER.userinfo.headico = ret.headico;
            //GAMECENTER.SaveUserInfo();
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
        });
    }
    PERSONINFO_SECOND.onHeadSel = onHeadSel;
    function onHeadSel2(imgPath) {
        GAMECENTER.gsUserSetHeadIco2({ mysession: GAMECENTER.userinfo.session, path: imgPath }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ret = resp.data;
            //GAMECENTER.userinfo.headico = ret.headico;
            //GAMECENTER.SaveUserInfo();
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
        });
    }
    PERSONINFO_SECOND.onHeadSel2 = onHeadSel2;
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
    PERSONINFO_SECOND.setCity = setCity;
    function switchAccount() {
        GAMECENTER.userinfo = null;
        GAMECENTER.SaveUserInfo();
        utils.setCookie("userinfo", null);
        window.location.href = "login.html";
    }
    PERSONINFO_SECOND.switchAccount = switchAccount;
})(PERSONINFO_SECOND || (PERSONINFO_SECOND = {}));
//# sourceMappingURL=personInfo.js.map