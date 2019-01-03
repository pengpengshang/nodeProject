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
        PERSONALINFO_NEW.initUser(userinfo);
        PERSONALINFO_NEW.loaddefImgs();
    })
});
module PERSONALINFO_NEW {
    var guid: HTMLImageElement = <any>document.getElementById("guid");
    var guicon: HTMLImageElement = <any>document.getElementById("guicon");
    var guname: HTMLInputElement = <any>document.getElementById("nickname");
    var PI_info: HTMLInputElement = <any>document.getElementById("PI_info");
    var gcity = <any>document.getElementById("cityChoose");
    var bindPhoneStatus = document.getElementById("bindPhoneStatus");
    var bindMailStatus = document.getElementById("bindMailStatus");
    export function initUser(userinfo: GAMECENTER.GSUSERINFO) {
        guicon.src = userinfo.headico;//头像
        guname.textContent = userinfo.nickname;//昵称
        guid.textContent = userinfo.sdkuserid.toString();//用户号
        if (userinfo.address == ""||userinfo.address==null) {//地址
            gcity.textContent = "未填写";
        } else {
            gcity.textContent = userinfo.address;
        }
        var para: GAMECENTER.GSUSERLVREQ = new GAMECENTER.GSUSERLVREQ();
        para.userid = userinfo.sdkuserid;
        GAMECENTER.gsUserLv(para, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var res: GAMECENTER.GSUSERLVRESP = resp.data;
            var lv = res.gslv;
            if (lv >= 1 && lv < 6) {
                for (var i = lv; i >= 1; i--) {
                    var img: HTMLImageElement = <any>document.createElement("img");
                    img.src = "../style/img/index/LV_CU.gif";
                    PI_info.appendChild(img);
                }
            } else if (lv >= 6 && lv < 11) {
                for (var i = lv; i >= 6; i--) {
                    var img: HTMLImageElement = <any>document.createElement("img");
                    img.src = "../style/img/index/LV_AG.gif";
                    PI_info.appendChild(img);
                }
            } else {
                for (var i = lv; i >= 11; i--) {
                    var img: HTMLImageElement = <any>document.createElement("img");
                    img.src = "../style/img/index/LV_AU.gif";
                    PI_info.appendChild(img);
                }
            }
        });
        if (!userinfo.phone) {
            bindPhoneStatus.textContent = "未绑定";
            bindPhoneStatus.setAttribute("href", "modifyMess.html#/modifyPhone");
        } else {
            bindPhoneStatus.textContent = "更换";
            bindPhoneStatus.setAttribute("href", "modifyMess.html#/phoneBind");
        }
        if (!userinfo.email) {
            bindMailStatus.textContent = "未绑定";
            bindMailStatus.setAttribute("href", "modifyMess.html#/modifymail");
        } else {
            bindMailStatus.textContent = "更换";
            bindMailStatus.setAttribute("href", "modifyMess.html#/mailBind");
        }
    }

    export function switchAccount() {//切换用户，返回登入页
        GAMECENTER.userinfo = null;
        GAMECENTER.SaveUserInfo();
        utils.setCookie("userinfo", null);
        window.location.href = "loginIndex.html";
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
    export function loaddefImgs() {//加载默认头像列表
        var imgList: string[] = [];
        var system_headshot = $("#system_headshot");
        GAMECENTER.getdefaultImgs(function (resp) {
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
            GAMECENTER.userinfo.headico = ret.headico;
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
            GAMECENTER.userinfo.headico = ret.headico;
            $("#guicon").get(0)["src"] = ret.headico + "?" + Math.random();
        });
    }
    export function show(show_div) {
        $("#" + show_div).show();
    }
    export function close(close_div) {
        $("#" + close_div).hide();
    }
}