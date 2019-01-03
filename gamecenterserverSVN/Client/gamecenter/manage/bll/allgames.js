$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        ALLGAMES.loadSource();
        ALLGAMES.loadallgames(null, null, null);
    });
});
var ALLGAMES;
(function (ALLGAMES) {
    var cpuser;
    var yshgametable;
    var yshgameitem;
    var yshgameitems = [];
    var nshgametable;
    var nshgameitem;
    var nshgameitems = [];
    function loadallgames(appname, cpid, mode) {
        yshgametable = document.getElementById("yshgame");
        yshgameitem = document.getElementById("yshgameitems");
        nshgametable = document.getElementById("nshgame");
        nshgameitem = document.getElementById("nshgameitems");
        yshgameitem.style.display = "none";
        nshgameitem.style.display = "none";
        var para = new ADMIN.ADMINGETCPAPPLISTREQ();
        para.appname = appname;
        para.cpid = cpid;
        para.mode = mode;
        ADMIN.adminGetCPAppsList_old(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < yshgameitems.length; i++) {
                yshgametable.removeChild(yshgameitems[i]);
            }
            yshgameitems.splice(0);
            for (var i = 0; i < nshgameitems.length; i++) {
                nshgametable.removeChild(nshgameitems[i]);
            }
            nshgameitems.splice(0);
            var dat = new ADMIN.ADMINGETCPAPPLISTRESP();
            var data = dat.data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var cpappinfo = data[i];
                if ("已通过" == cpappinfo.status) {
                    var yshitem = yshgameitem.cloneNode(true);
                    yshitem.style.display = "";
                    $(yshitem).find("#appname").text(cpappinfo.appname);
                    $(yshitem).find("#addtime").text(new Date(cpappinfo.addtime).toLocaleDateString());
                    $(yshitem).find("#createtime").text(new Date(cpappinfo.createtime).toLocaleDateString());
                    $(yshitem).find("#yshIcon").attr("src", cpappinfo.ico);
                    if (cpappinfo.url != null) {
                        $(yshitem).find("#url").text(cpappinfo.url);
                    }
                    if (cpappinfo.posturl != null) {
                        $(yshitem).find("#posturl").text(cpappinfo.posturl);
                    }
                    (function (mdata) {
                        $(yshitem).find("#ysheditor").click(function (ev) {
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        });
                        $(yshitem).find("#yshdown").click(function (ev) {
                            var para = new ADMIN.ADMINDOWNREQ();
                            para.appid = mdata.appid;
                            para.appname = mdata.appname;
                            if (window.confirm("下架(" + mdata.appname + ")?")) {
                                down(para);
                            }
                        });
                        if (mdata.ishot == 1 && mdata.isrec == 1) {
                            $(yshitem).find("#selType").find("option[value='all']").attr("selected", "true");
                        }
                        else if (mdata.ishot == 1 && mdata.isrec == 0) {
                            $(yshitem).find("#selType").find("option[value='hot']").attr("selected", "true");
                        }
                        else if (mdata.ishot == 0 && mdata.isrec == 1) {
                            $(yshitem).find("#selType").find("option[value='rec']").attr("selected", "true");
                        }
                        else {
                            $(yshitem).find("#selType").find("option[value='none']").attr("selected", "true");
                        }
                        $(yshitem).find("#selType").attr("onchange", "ALLGAMES.pushTo(" + mdata.appid + ",'" + mdata.appname + "',$(this).val());");
                        $(yshitem).find("#yshgift").attr("href", "giftbag.html?gameid=" + mdata.appid + "&gamename=" + mdata.appname);
                        $(yshitem).find("#yshopen").click(function (ev) {
                            alert("敬请期待！！！");
                            return;
                        });
                    })(cpappinfo);
                    yshgametable.appendChild(yshitem);
                    yshgameitems.push(yshitem);
                }
                else {
                    var nshitem = nshgameitem.cloneNode(true);
                    nshitem.style.display = "";
                    $(nshitem).find("#ck_appname").val(cpappinfo.appname);
                    $(nshitem).find("#appname").text(cpappinfo.appname);
                    $(nshitem).find("#nshIcon").attr("src", cpappinfo.ico);
                    $(nshitem).find("#addtime").text(new Date(cpappinfo.addtime).toLocaleDateString());
                    if (cpappinfo.cpname != null) {
                        $(nshitem).find("#source").text(cpappinfo.cpname);
                    }
                    if (cpappinfo.mode != null) {
                        $(nshitem).find("#mode").text(cpappinfo.mode);
                    }
                    if (cpappinfo.testurl != null) {
                        $(nshitem).find("#testurl").text(cpappinfo.testurl);
                    }
                    if (cpappinfo.url != null) {
                        $(nshitem).find("#url").text(cpappinfo.url);
                    }
                    if (cpappinfo.posturl != null) {
                        $(nshitem).find("#posturl").text(cpappinfo.posturl);
                    }
                    $(nshitem).find("#isad").text(cpappinfo.isad);
                    if (cpappinfo.status != null) {
                        $(nshitem).find("#status").text(cpappinfo.status);
                    }
                    (function (mdata) {
                        $(nshitem).find("#nsheditor").click(function (ev) {
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        });
                        $(nshitem).find("#nshtest").click(function (ev) {
                            if (mdata.url != null || mdata.url != "") {
                                utils.setStorage("testUrl", mdata.url, "sessionStorage");
                            }
                            else if (mdata.testurl != null || mdata.testurl != "") {
                                utils.setStorage("testUrl", mdata.testurl, "sessionStorage");
                            }
                            else {
                                utils.setStorage("testUrl", mdata.testurl, "sessionStorage");
                            }
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                            window.location.href = "testTopUp.html?appid=" + mdata.appid + "&appname=" + encodeURIComponent(mdata.appname);
                        });
                        $(nshitem).find("#pass").click(function (ev) {
                            if (window.confirm("通过(" + mdata.appname + ")?")) {
                                pass(mdata);
                            }
                        });
                        $(nshitem).find("#nopass").click(function (ev) {
                            var para = new ADMIN.ADMINNOPASSREQ();
                            para.appid = mdata.appid;
                            para.appname = mdata.appname;
                            if (window.confirm("不通过(" + mdata.appname + ")?")) {
                                nopass(para);
                            }
                        });
                        $(nshitem).find("#del").click(function (ev) {
                            var para = new ADMIN.ADMINNOPASSREQ();
                            para.appid = mdata.appid;
                            para.appname = mdata.appname;
                            if (window.confirm("删除(" + mdata.appname + ")?")) {
                                del(para);
                            }
                        });
                    })(cpappinfo);
                    nshgametable.appendChild(nshitem);
                    nshgameitems.push(nshitem);
                }
            }
        });
    }
    ALLGAMES.loadallgames = loadallgames;
    function loadSource() {
        var para = new ADMIN.ADMINGETCPLISTREQ();
        cpuser = document.getElementById("source");
        ADMIN.adminGetCpList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var data = dat.data[i];
                var opt = document.createElement("option");
                opt.innerText = data.nickname;
                opt.value = data.cpid.toString();
                cpuser.appendChild(opt);
            }
        });
    }
    ALLGAMES.loadSource = loadSource;
    function pass(pass) {
        ADMIN.adminpassCPAppInfo(pass, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    function nopass(nopass) {
        ADMIN.adminnopassCPAppInfo(nopass, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    function del(del) {
        ADMIN.admindelAppInfo(del, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    function down(down) {
        ADMIN.admindownCPAppInfo(down, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    function pushTo(appid, appname, flags) {
        var para = new ADMIN.ADMINPUSHTOREQ();
        para.appid = appid;
        para.appname = appname;
        para.pushto = flags;
        ADMIN.adminPushTo(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("移动成功");
            window.location.reload();
        });
    }
    ALLGAMES.pushTo = pushTo;
    function passAll() {
        var para = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('nshgame'));
        para.appnames = gamenames;
        ADMIN.adminGetCheckList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            ADMIN.adminpassAll(data, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                alert("成功");
                window.location.reload();
            });
        });
    }
    ALLGAMES.passAll = passAll;
})(ALLGAMES || (ALLGAMES = {}));
//# sourceMappingURL=allgames.js.map