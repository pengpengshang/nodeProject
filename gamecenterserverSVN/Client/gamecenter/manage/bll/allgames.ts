$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        ALLGAMES.loadSource();
        ALLGAMES.loadallgames(null, null, null);
    });
});
module ALLGAMES {
    var cpuser: HTMLSelectElement;
    var yshgametable: HTMLTableElement;
    var yshgameitem: HTMLTableRowElement;
    var yshgameitems: HTMLTableRowElement[] = [];
    var nshgametable: HTMLTableElement;
    var nshgameitem: HTMLTableRowElement;
    var nshgameitems: HTMLTableRowElement[] = [];
    export function loadallgames(appname, cpid, mode) {
        yshgametable = <any>document.getElementById("yshgame");
        yshgameitem = <any>document.getElementById("yshgameitems");
        nshgametable = <any>document.getElementById("nshgame");
        nshgameitem = <any>document.getElementById("nshgameitems");
        yshgameitem.style.display = "none";
        nshgameitem.style.display = "none";
        var para = new ADMIN.ADMINGETCPAPPLISTREQ();
        para.appname = appname;
        para.cpid = cpid;
        para.mode = mode;
        ADMIN.adminGetCPAppsList_old(para, resp => {
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
            var dat: ADMIN.ADMINGETCPAPPLISTRESP = new ADMIN.ADMINGETCPAPPLISTRESP();
            var data: ADMIN.ADMINAPPINFO[] = dat.data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var cpappinfo: ADMIN.ADMINAPPINFO = data[i];
                if ("已通过" == cpappinfo.status) {
                    var yshitem: HTMLTableRowElement = <any>yshgameitem.cloneNode(true);
                    yshitem.style.display = "";
                    $(yshitem).find("#appname").text(cpappinfo.appname);
                    $(yshitem).find("#addtime").text(new Date(cpappinfo.addtime).toLocaleDateString());
                    $(yshitem).find("#createtime").text(new Date(cpappinfo.createtime).toLocaleDateString());
                    $(yshitem).find("#yshIcon").attr("src",cpappinfo.ico);
                    if (cpappinfo.url != null) {
                        $(yshitem).find("#url").text(cpappinfo.url);
                    }
                    if (cpappinfo.posturl != null) {
                        $(yshitem).find("#posturl").text(cpappinfo.posturl);
                    }
                    (function (mdata: ADMIN.ADMINAPPINFO) {
                        $(yshitem).find("#ysheditor").click(ev => {
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        });
                        $(yshitem).find("#yshdown").click(ev => {
                            var para: ADMIN.ADMINDOWNREQ = new ADMIN.ADMINDOWNREQ();
                            para.appid = mdata.appid;
                            para.appname = mdata.appname;
                            if (window.confirm("下架(" + mdata.appname + ")?")) {
                                down(para);
                            }
                        });
                        if (mdata.ishot==1 && mdata.isrec==1) {
                            $(yshitem).find("#selType").find("option[value='all']").attr("selected", "true");
                        } else if (mdata.ishot == 1 && mdata.isrec == 0){
                            $(yshitem).find("#selType").find("option[value='hot']").attr("selected", "true");
                        } else if (mdata.ishot == 0 && mdata.isrec == 1) {
                            $(yshitem).find("#selType").find("option[value='rec']").attr("selected", "true");
                        } else{
                            $(yshitem).find("#selType").find("option[value='none']").attr("selected", "true");
                        }
                        $(yshitem).find("#selType").attr("onchange","ALLGAMES.pushTo("+mdata.appid+",'"+mdata.appname+"',$(this).val());")
                        $(yshitem).find("#yshgift").attr("href", "giftbag.html?gameid="+mdata.appid+"&gamename="+mdata.appname);
                        $(yshitem).find("#yshopen").click(ev => {
                            alert("敬请期待！！！");
                            return;
                        });
                    })(cpappinfo);
                    yshgametable.appendChild(yshitem);
                    yshgameitems.push(yshitem);
                } else {
                    var nshitem: HTMLTableRowElement = <any>nshgameitem.cloneNode(true);
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
                    (function (mdata: ADMIN.ADMINAPPINFO) {
                        $(nshitem).find("#nsheditor").click(ev => {
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        });
                        $(nshitem).find("#nshtest").click(ev => {
                            if (mdata.url != null || mdata.url != "") {
                                utils.setStorage("testUrl", mdata.url, "sessionStorage");
                            } else if (mdata.testurl != null || mdata.testurl != "") {
                                utils.setStorage("testUrl", mdata.testurl, "sessionStorage");
                            } else {
                                utils.setStorage("testUrl", mdata.testurl, "sessionStorage");
                            }
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                            window.location.href = "testTopUp.html?appid=" + mdata.appid + "&appname=" + encodeURIComponent(mdata.appname);
                        });
                        $(nshitem).find("#pass").click(ev => {
                            if (window.confirm("通过(" + mdata.appname + ")?")) {
                                pass(mdata);
                            }
                        });
                        $(nshitem).find("#nopass").click(ev => {
                            var para: ADMIN.ADMINNOPASSREQ = new ADMIN.ADMINNOPASSREQ();
                            para.appid = mdata.appid;
                            para.appname = mdata.appname;
                            if (window.confirm("不通过(" + mdata.appname + ")?")) {
                                nopass(para);
                            }
                        });
                        $(nshitem).find("#del").click(ev => {
                            var para: ADMIN.ADMINNOPASSREQ = new ADMIN.ADMINNOPASSREQ();
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
    export function loadSource() {//加载所有CP列表
        var para = new ADMIN.ADMINGETCPLISTREQ();
        cpuser = <any>document.getElementById("source");
        ADMIN.adminGetCpList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETCPLISTRESP = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var data = dat.data[i];
                var opt: HTMLOptionElement = document.createElement("option");
                opt.innerText = data.nickname;
                opt.value = data.cpid.toString();
                cpuser.appendChild(opt);
            }
        });
    }
    function pass(pass: ADMIN.CPAPPINFO) {//通过
        ADMIN.adminpassCPAppInfo(pass, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    function nopass(nopass: ADMIN.ADMINNOPASSREQ) {//不通过
        ADMIN.adminnopassCPAppInfo(nopass, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    function del(del: ADMIN.ADMINDELREQ) {//删除
        ADMIN.admindelAppInfo(del, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    function down(down: ADMIN.ADMINDOWNREQ) {//下架
        ADMIN.admindownCPAppInfo(down, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    export function pushTo(appid,appname, flags) {//推送到热门以及分类
        var para: ADMIN.ADMINPUSHTOREQ = new ADMIN.ADMINPUSHTOREQ();
        para.appid = appid;
        para.appname = appname;
        para.pushto = flags;
        ADMIN.adminPushTo(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("移动成功");
            window.location.reload();
        });
    }

    export function passAll() {//全部通过
        var para: ADMIN.ADMINGETCHECKAPPINFOREQ = new ADMIN.ADMINGETCHECKAPPINFOREQ(); 
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('nshgame'));
        para.appnames = gamenames;
        ADMIN.adminGetCheckList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.ADMINCPAPPINFOREQ[] = resp.data;
            ADMIN.adminpassAll(data, resp => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                alert("成功");
                window.location.reload();
            });
        })
    }
}