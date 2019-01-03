$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        ALLGAMES_NEW.loadallgames_new(null, null, null, null, '已通过', 0);
        ALLGAMES_NEW.loadData_new(null, null);
        ALLGAMES_NEW.loadNewgame_sort(null, '1');
    });
});
var ALLGAMES_NEW;
(function (ALLGAMES_NEW) {
    var cpuser;
    var yshgametable;
    var yshgameitem;
    var yshgameitems = [];
    var nshgametable;
    var nshgameitem;
    var nshgameitems = [];
    var outgametable;
    var outgameitem;
    var outgameitems = [];
    var data;
    var icofile, //
    adfile, bannerfile, backfile, posturl, //支付回调地址
    cpname, //对接方
    url, //游戏地址入口
    lable; //游戏标签
    var mode, //合作模式
    gametype; //游戏类型
    var adimg, //广告图片
    backimg, //背景图片 
    bannerimg, icoimg; //游戏图标
    var hotgametable;
    var hotgameitem;
    var hotgameitems = [];
    var hotgametable2;
    var hotgameitem2;
    var hotgameitems2 = [];
    var recgametable;
    var recgameitem;
    var recgameitems = [];
    var j = 0, k = 0;
    function loadallgames_new(time, appname, cpid, mode, leixing, sort) {
        yshgametable = document.getElementById("yshgame");
        yshgameitem = document.getElementById("yshgameitems");
        nshgametable = document.getElementById("nshgame");
        nshgameitem = document.getElementById("nshgameitems");
        outgametable = document.getElementById("outgame");
        outgameitem = document.getElementById("outgameitems");
        yshgameitem.style.display = "none";
        nshgameitem.style.display = "none";
        outgameitem.style.display = "none";
        var para = new ADMIN.ADMINGETCPAPPLISTREQ();
        para.time = time;
        para.appname = appname;
        para.cpid = cpid;
        para.mode = mode;
        para.status = leixing;
        para.sort = sort;
        ADMIN.adminGetCPAppsList(para, function (resp) {
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
            for (var i = 0; i < outgameitems.length; i++) {
                outgametable.removeChild(outgameitems[i]);
            }
            outgameitems.splice(0);
            var dat = new ADMIN.ADMINGETCPAPPLISTRESP();
            var data = dat.data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var cpappinfo = data[i];
                if ("已通过" == cpappinfo.status) {
                    var yshitem = yshgameitem.cloneNode(true);
                    yshitem.style.display = "";
                    $(yshitem).find("#game_appname").text(cpappinfo.appname);
                    $(yshitem).find("#ck_appname").val(cpappinfo.appname);
                    $(yshitem).find("#addtime").text(new Date(cpappinfo.addtime).toLocaleDateString());
                    $(yshitem).find("#createtime").text(new Date(cpappinfo.createtime).toLocaleDateString());
                    $(yshitem).find("#yshIcon").attr("src", cpappinfo.ico);
                    $(yshitem).find("#game_type").text(cpappinfo.mode);
                    $(yshitem).find("#game_lable").text(cpappinfo.lable);
                    $(yshitem).find("#game_click").text(cpappinfo.opencount);
                    $(yshitem).find("#game_duijie").text(cpappinfo.nickname);
                    if (cpappinfo.url != null) {
                        $(yshitem).find("#url").text(cpappinfo.url);
                    }
                    if (cpappinfo.posturl != null) {
                        $(yshitem).find("#posturl").text(cpappinfo.posturl);
                    }
                    (function (mdata) {
                        $(yshitem).find("#game_appname").click(function (ev) {
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                            window.location.href = "editor.html";
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
                        $(yshitem).find("#selType").attr("onchange", "ALLGAMES_NEW.pushTo(" + mdata.appid + ",'" + mdata.appname + "',$(this).val());");
                    })(cpappinfo);
                    yshgametable.appendChild(yshitem);
                    yshgameitems.push(yshitem);
                }
                else {
                    if ("" == cpappinfo.status || '未审核' == cpappinfo.status) {
                        var nshitem = nshgameitem.cloneNode(true);
                        nshitem.style.display = "";
                        $(nshitem).find("#ck_appname").val(cpappinfo.appname);
                        $(nshitem).find("#appname").text(cpappinfo.appname);
                        $(nshitem).find("#nshIcon").attr("src", cpappinfo.ico);
                        $(nshitem).find("#addtime").text(new Date(cpappinfo.addtime).toLocaleDateString());
                        if (cpappinfo.url != null) {
                            $(nshitem).find("#game_addr").text("有");
                        }
                        if (cpappinfo.posturl != null) {
                            $(nshitem).find("#game_pay_back").text("有");
                        }
                        $(nshitem).find("#isad").text(cpappinfo.isad);
                        if (cpappinfo.status != null) {
                            $(nshitem).find("#isad").text("有");
                        }
                        (function (mdata) {
                            $(nshitem).find("#appname").click(function (ev) {
                                sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                                window.location.href = "editor.html";
                            });
                        })(cpappinfo);
                        nshgametable.appendChild(nshitem);
                        nshgameitems.push(nshitem);
                    }
                    else {
                        //已下架游戏列表
                        var outitem = outgameitem.cloneNode(true);
                        outitem.style.display = "";
                        $(outitem).find("#out_game_name").text(cpappinfo.appname);
                        $(outitem).find("#out_game_icon").attr("src", cpappinfo.ico);
                        $(outitem).find("#out_game_addtime").text(new Date(cpappinfo.uptime).toLocaleDateString());
                        $(outitem).find("#ck_appname").val(cpappinfo.appname);
                        //                      console.log(cpappinfo.downreason);
                        $(outitem).find("#out_reason").text(cpappinfo.downreason);
                        console.log(cpappinfo.downreason);
                        (function (mdata) {
                            $(outitem).find("#out_game_name").click(function (ev) {
                                sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                                window.location.href = "editor.html";
                            });
                        })(cpappinfo);
                        outgametable.appendChild(outitem);
                        outgameitems.push(outitem);
                    }
                }
            }
        });
    }
    ALLGAMES_NEW.loadallgames_new = loadallgames_new;
    $("#chongxin_shangjia").click(function (ev) {
        var para = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('outgame'));
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
                console.log("成功");
                window.location.reload();
            });
        });
    });
    $("#del2").click(function (ev) {
        var para = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('outgame'));
        para.appnames = gamenames;
        ADMIN.adminGetCheckList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            ADMIN.admindelAll(data, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                console.log("成功");
                window.location.reload();
            });
        });
    });
    $("#pass").click(function (ev) {
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
                console.log("成功");
                window.location.reload();
            });
        });
    });
    $("#del").click(function (ev) {
        var para = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('nshgame'));
        para.appnames = gamenames;
        ADMIN.adminGetCheckList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            ADMIN.admindelAll(data, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                console.log("成功");
                window.location.reload();
            });
        });
    });
    $("#yshdown").click(function (ev) {
        var para = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('yshgame'));
        para.appnames = gamenames;
        //  para.downreason = $("#down_reason").val();
        ADMIN.adminGetCheckList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            data[0].downreason = $("#down_reason").val();
            console.log($("#down_reason").val());
            ADMIN.admindownAll(data, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                console.log("成功");
                window.location.reload();
            });
        });
    });
    function loadDefData_new() {
        icofile = document.getElementById("icofile");
        adfile = document.getElementById("adfile");
        bannerfile = document.getElementById("bannerfile");
        backfile = document.getElementById("backfile");
        mode = document.getElementById("game_coopration"); //合作模式
        gametype = document.getElementById("game_type_input"); //游戏类型
        //        cpname = <any>document.getElementById("game_getin");        //对接方
        lable = document.getElementById("game_lable_input"); //游戏标签
        adimg = document.getElementById("game_advert_img"); //广告图
        backimg = document.getElementById("game_background");
        bannerimg = document.getElementById("game_small_banner");
        icoimg = document.getElementById("game_icon"); //游戏图标
        posturl = document.getElementById("game_pay_back"); //支付回调
        url = document.getElementById("game_addr"); //入口地址
        var num = onRand();
        $("#game_secret").text(num);
        var para = sessionStorage["ADMINCPAPPINFO"];
        if (para) {
            data = JSON.parse(para);
            $("#appappnum").text(data.appid);
        }
    }
    ALLGAMES_NEW.loadDefData_new = loadDefData_new;
    function saveAppinfo_new() {
        var para = new ADMIN.ADMINAPPINFOREQ();
        para.cpid = 2;
        para.nickname = $("#game_getin").val();
        para.cpname = $("#game_getin").val();
        para.appname = $("#game_name").val(); //游戏名称
        para.intro = $("#game_descrip").val(); //游戏描述
        para.mode = mode.value;
        para.gametype = gametype.value;
        para.lable = $("#game_lable_input").val();
        para.introduction = $("#game_introduction").val(); //游戏详情介绍
        console.log(para.lable);
        //        para.playcount = $("#inputmanynum").val();
        //        para.recommend = 0;
        //        para.appsecret = $("#appsecnum").text();
        para.posturl = $("#add_game_pay_back").val();
        para.url = $("#add_game_addr").val();
        para.appsecret = $("#game_secret").text();
        para.profit = $("#cp_chanrge").val();
        var files = [];
        var filename;
        if (icofile.files.length > 0) {
            files[0] = icofile.files[0];
            filename = icofile.files[0].name;
            para.ico = filename.substring(filename.indexOf(".")); //已appid+扩展名的方式
        }
        else {
            filename = icoimg.src;
            para.ico = filename.substr(filename.indexOf("?") - 4, 4);
        }
        if (adfile.files.length > 0) {
            files[1] = adfile.files[0];
        }
        if (backfile.files.length > 0) {
            files[2] = backfile.files[0];
        }
        if (bannerfile.files.length > 0) {
            files[3] = bannerfile.files[0];
        }
        console.log(files);
        ADMIN.adminSaveCPAppInfo_new(para, files, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            para.appid = resp.data.appid;
            alert("保存成功!");
            console.log("保存成功");
            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(para);
            window.location.reload();
        });
    }
    ALLGAMES_NEW.saveAppinfo_new = saveAppinfo_new;
    function onRand() {
        var chr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var num = "";
        for (var i = 0; i < 20; i++) {
            num += chr.substr(Math.floor(Math.random() * chr.length), 1);
        }
        //var num = Math.floor(Math.random() * 90000000000 + 10000000000).toFixed(0);
        return num;
    }
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
    ALLGAMES_NEW.pushTo = pushTo;
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
    ALLGAMES_NEW.passAll = passAll;
    function loadData_new(appname, starts) {
        ALLGAMES_NEW.loadDefData_new();
        var m = 0;
        hotgametable = document.getElementById("hotgames");
        hotgameitem = document.getElementById("hotgameitems");
        recgametable = document.getElementById("recgames");
        hotgameitem.style.display = "none";
        var para = new ADMIN.ADMINGETH5GAMELISTREQ();
        para.starts = starts;
        para.appname = appname;
        ADMIN.adminGetH5GameList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < hotgameitems.length; i++) {
                hotgametable.removeChild(hotgameitems[i]);
            }
            hotgameitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.applist.length; i++) {
                var appinfo = dat.applist[i];
                if (appinfo.ishot == 1) {
                    m++;
                    var hotitem = hotgameitem.cloneNode(true);
                    hotitem.style.display = "";
                    $(hotitem).find('#hotnum').text(m);
                    $(hotitem).find("#hotpic").attr("src", appinfo.ico);
                    $(hotitem).find('#hotappid').text(appinfo.id);
                    $(hotitem).find('#hotappname').text(appinfo.name);
                    if (!!para.starts) {
                        $(hotitem).find('#hotorderby').val(appinfo.newsort);
                    }
                    else {
                        $(hotitem).find('#hotorderby').val(appinfo.orderby);
                    }
                    $(hotitem).find('#create_time').text(new Date(appinfo.createtime).toLocaleDateString());
                    (function (mdata) {
                        $(hotitem).find("#hotorderby").attr("onkeydown", "if (event.keyCode == 13) {KINDOFGAME.sortInsert_new(" + mdata.id + ",$(this).val())}");
                        $(hotitem).find("#hottop").click(function (ev) {
                            if (window.confirm("置顶(" + mdata.name + ")?")) {
                                sortClick_new(3, mdata.orderby, mdata.id, 1, null);
                            }
                        });
                        $(hotitem).find("#hotbottom").click(function (ev) {
                            if (window.confirm("置底(" + mdata.name + ")?")) {
                                sortClick_new(4, mdata.orderby, mdata.id, 1, null);
                            }
                        });
                        $(hotitem).find("#hotremove").click(function (ev) {
                            if (window.confirm("移出推荐?")) {
                                removeHotOrRec_new("hot", mdata.id);
                            }
                        });
                    })(appinfo);
                    hotgametable.appendChild(hotitem);
                    hotgameitems.push(hotitem);
                }
            }
        });
    }
    ALLGAMES_NEW.loadData_new = loadData_new;
    function loadNewgame_sort(appname, starts) {
        ALLGAMES_NEW.loadDefData_new();
        var m = 0;
        hotgametable2 = document.getElementById("hotgames2");
        hotgameitem2 = document.getElementById("hotgameitems2");
        recgametable = document.getElementById("recgames2");
        hotgameitem2.style.display = "none";
        var para = new ADMIN.ADMINGETH5GAMELISTREQ();
        para.starts = '1';
        para.appname = appname;
        ADMIN.adminGetH5GameList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < hotgameitems2.length; i++) {
                hotgametable2.removeChild(hotgameitems2[i]);
            }
            hotgameitems2.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.applist.length; i++) {
                var appinfo = dat.applist[i];
                m++;
                var hotitem = hotgameitem2.cloneNode(true);
                hotitem.style.display = "";
                $(hotitem).find('#hotnum2').text(m);
                $(hotitem).find("#hotpic2").attr("src", appinfo.ico);
                $(hotitem).find('#hotappid2').text(appinfo.id);
                $(hotitem).find('#hotappname2').text(appinfo.name);
                $(hotitem).find('#hotorderby2').val(appinfo.newsort);
                $(hotitem).find('#create_time2').text(new Date(appinfo.createtime).toLocaleDateString());
                hotgametable2.appendChild(hotitem);
                hotgameitems2.push(hotitem);
            }
        });
    }
    ALLGAMES_NEW.loadNewgame_sort = loadNewgame_sort;
    function sortInsert_new(id, sort) {
        var para = new ADMIN.ADMINSORTINSERTREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortInsert(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    ALLGAMES_NEW.sortInsert_new = sortInsert_new;
    function sortInsert_allgame() {
        var para = new ADMIN.ADMINSORTINSERTREQ();
        var arr = new Array();
        $(".hotappid").each(function () {
            arr.push($(this).text());
        });
        para.all_id = arr;
        ADMIN.adminSortInsert_allgame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    ALLGAMES_NEW.sortInsert_allgame = sortInsert_allgame;
    function sortInsert_newgame() {
        var para = new ADMIN.ADMINSORTINSERTREQ();
        var arr = new Array();
        $(".hotappid2").each(function () {
            arr.push($(this).text());
        });
        para.all_id = arr;
        ADMIN.adminSortInsert_newgame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    ALLGAMES_NEW.sortInsert_newgame = sortInsert_newgame;
    function sortClick_new(flags, orderby, id, ishot, isrec) {
        var para = new ADMIN.ADMINSORTCLICKREQ();
        para.flags = flags;
        para.id = id;
        para.orderby = orderby;
        para.ishot = ishot;
        para.isrec = isrec;
        ADMIN.adminSortClick(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    ALLGAMES_NEW.sortClick_new = sortClick_new;
    function removeHotOrRec_new(flags, id) {
        var para = new ADMIN.ADMINREMOVEHOTORREC();
        para.flags = flags;
        para.id = id;
        ADMIN.adminRemoveHotORec(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    ALLGAMES_NEW.removeHotOrRec_new = removeHotOrRec_new;
})(ALLGAMES_NEW || (ALLGAMES_NEW = {}));
//# sourceMappingURL=game.js.map