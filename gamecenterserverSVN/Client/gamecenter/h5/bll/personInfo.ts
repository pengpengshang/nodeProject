$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "login.html";
            });
            return;
        }
        PERSONINFO_SECOND.loadPersoninfo(userinfo);
        PERSONINFO_SECOND.loaddefImgs();
    });
});  
module PERSONINFO_SECOND {
    export function loadPersoninfo(userinfo: GAMECENTER.GSUSERINFO) {
        $("#nickname").val(userinfo.nickname);
        $("#guicon").attr("src", userinfo.headico);
        if (userinfo.sex == 1) {
            $("#nan").attr("checked", "checked");
        } else {
            $("#nv").attr("checked", "checked");
        }

        if (!userinfo.address) {
            $("#cityChoose").text("未填写");
        } else {
            $("#cityChoose").text(userinfo.address);
        }

        $(".fill_phone").click(function () {
            if (!userinfo.phone) {
                window.location.href = 'fillInfo.html#/modifyPhone';
            } else {
                window.location.href = 'fillInfo.html#/phoneBind';
            }
        })
        $(".fill_email").click(function () {
            if (!userinfo.email) {
                window.location.href = 'fillInfo.html#/modifymail';
            } else {
                window.location.href = 'fillInfo.html#/mailBind';
            }
        })
    }
    export function updateNickName() {//修改昵称
        var guname: HTMLInputElement = <any>document.getElementById("nickname");
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
        } else {
            GAMECENTER.gsUserSetNickName(para, resp => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                $("#nickname").val(para.nickname);
            });
        }
    }
    export function changeSex(sex) {
        var para:GAMECENTER.CHANGESEXREQ = new GAMECENTER.CHANGESEXREQ();
        para.sex = sex;
        para.userid = GAMECENTER.userinfo.sdkuserid;
        para.mysession = GAMECENTER.userinfo.session;
        GAMECENTER.changeSex(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            if (para.sex == 1) {
                $("#nan").attr("checked", "checked");
            } else {
                $("#nv").attr("checked", "checked");
            }
        })
    }
    export function loaddefImgs() {//加载默认头像列表
        var imgList: string[] = [];
        var system_headshot = $("#system_headshot");
        GAMECENTER.getdefaultImgs_second(function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
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
            childs.click(function (e) {//选定图片
                e.stopPropagation();
                var path = $(this).children().attr("src");
                $(this).find("img").addClass('active')
                $(this).siblings().find("img").removeAttr('class');
                document.getElementById("confirm").onclick = function () {
                    onHeadSel2(path);
                }
            })
        });
    }
    var headfile: HTMLInputElement = <any>document.getElementById("modifyhead");
    export function onHeadSel() {//修改头像
        var file;
        if (headfile.files.length > 0) file = headfile.files[0];
        else {
            return;
        }
        GAMECENTER.gsUserSetHeadIco({ mysession: GAMECENTER.userinfo.session }, file, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ret: GAMECENTER.GSUSERSETHEADICORESP = resp.data;
            //GAMECENTER.userinfo.headico = ret.headico;
            //GAMECENTER.SaveUserInfo();
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
        });
    }
    export function onHeadSel2(imgPath) {//修改头像
        GAMECENTER.gsUserSetHeadIco2({ mysession: GAMECENTER.userinfo.session, path: imgPath }, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ret: GAMECENTER.GSUSERSETHEADICORESP = resp.data;
            //GAMECENTER.userinfo.headico = ret.headico;
            //GAMECENTER.SaveUserInfo();
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
        });
    }
    export function setCity(city) {//设置城市
        var para: GAMECENTER.GSSETCITYREQ = new GAMECENTER.GSSETCITYREQ();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.city = city;
        para.mysession = GAMECENTER.userinfo.session;
        GAMECENTER.gsSetCity(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
        });
    }

    export function switchAccount() {//切换用户，返回登入页
        GAMECENTER.userinfo = null;
        GAMECENTER.SaveUserInfo();
        utils.setCookie("userinfo", null);
        window.location.href = "login.html";
    }


}