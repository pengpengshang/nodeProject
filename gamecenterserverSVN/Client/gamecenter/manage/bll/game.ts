$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {

        ALLGAMES_NEW.loadallgames_new(null,null, null, null, '已通过',0);
       
        ALLGAMES_NEW.loadData_new(null, null);
        ALLGAMES_NEW.loadNewgame_sort(null,'1');
    });
});
module ALLGAMES_NEW {
    var cpuser: HTMLSelectElement;
    var yshgametable: HTMLTableElement;
    var yshgameitem: HTMLTableRowElement;
    var yshgameitems: HTMLTableRowElement[] = [];
    var nshgametable: HTMLTableElement;
    var nshgameitem: HTMLTableRowElement;
    var nshgameitems: HTMLTableRowElement[] = [];
    var outgametable: HTMLTableElement;
    var outgameitem: HTMLTableRowElement;
    var outgameitems: HTMLTableRowElement[] = [];
    var data: ADMIN.ADMINAPPINFO;
    var icofile: HTMLInputElement,//
        adfile: HTMLInputElement,
        bannerfile:HTMLInputElement,
        backfile: HTMLInputElement,
        posturl: HTMLInputElement,      //支付回调地址
        cpname: HTMLInputElement,       //对接方
        url: HTMLInputElement,         //游戏地址入口
        lable: HTMLInputElement;        //游戏标签
    var mode: HTMLSelectElement,       //合作模式
        gametype: HTMLSelectElement;    //游戏类型
    var adimg: HTMLImageElement,            //广告图片
        backimg: HTMLImageElement,      //背景图片 
        bannerimg:HTMLImageElement,
        icoimg: HTMLImageElement;       //游戏图标

    var hotgametable: HTMLTableElement;
    var hotgameitem: HTMLTableRowElement;
    var hotgameitems: HTMLTableRowElement[] = [];

    var hotgametable2: HTMLTableElement;
    var hotgameitem2: HTMLTableRowElement;
    var hotgameitems2: HTMLTableRowElement[] = [];
    var recgametable: HTMLTableElement;
    var recgameitem: HTMLTableRowElement;
    var recgameitems: HTMLTableRowElement[] = [];
    var j = 0, k = 0;
    export function loadallgames_new(time,appname, cpid, mode,leixing,sort) {
        yshgametable = <any>document.getElementById("yshgame");
        yshgameitem = <any>document.getElementById("yshgameitems");
        nshgametable = <any>document.getElementById("nshgame");
        nshgameitem = <any>document.getElementById("nshgameitems");
        outgametable = <any>document.getElementById("outgame");
        outgameitem = <any>document.getElementById("outgameitems");
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
        ADMIN.adminGetCPAppsList(para, resp => {
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
            var dat: ADMIN.ADMINGETCPAPPLISTRESP = new ADMIN.ADMINGETCPAPPLISTRESP();
            var data: ADMIN.ADMINAPPINFO[] = dat.data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var cpappinfo: ADMIN.ADMINAPPINFO = data[i];
                if ("已通过" == cpappinfo.status) {
                    var yshitem: HTMLTableRowElement = <any>yshgameitem.cloneNode(true);
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
                    (function (mdata: ADMIN.ADMINAPPINFO) {
                        $(yshitem).find("#game_appname").click(ev => {
                            sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                            window.location.href = "editor.html";
                        });


                        if (mdata.ishot == 1 && mdata.isrec == 1) {
                            $(yshitem).find("#selType").find("option[value='all']").attr("selected", "true");
                        } else if (mdata.ishot == 1 && mdata.isrec == 0) {
                            $(yshitem).find("#selType").find("option[value='hot']").attr("selected", "true");
                        } else if (mdata.ishot == 0 && mdata.isrec == 1) {
                            $(yshitem).find("#selType").find("option[value='rec']").attr("selected", "true");
                        } else {
                            $(yshitem).find("#selType").find("option[value='none']").attr("selected", "true");
                        }
                        $(yshitem).find("#selType").attr("onchange", "ALLGAMES_NEW.pushTo(" + mdata.appid + ",'" + mdata.appname + "',$(this).val());")

                       
                    })(cpappinfo);
                    yshgametable.appendChild(yshitem);
                    yshgameitems.push(yshitem);
                } else {
                    if ("" == cpappinfo.status || '未审核' == cpappinfo.status) {
                        var nshitem: HTMLTableRowElement = <any>nshgameitem.cloneNode(true);
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
                        (function (mdata: ADMIN.ADMINAPPINFO) {
                            $(nshitem).find("#appname").click(ev => {
                                sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                                window.location.href = "editor.html";
                            });
                           
                        })(cpappinfo);
                        nshgametable.appendChild(nshitem);
                        nshgameitems.push(nshitem);
                    } else {
                        //已下架游戏列表
                        var outitem: HTMLTableRowElement = <any>outgameitem.cloneNode(true);
                        outitem.style.display = "";
                        $(outitem).find("#out_game_name").text(cpappinfo.appname);
                        $(outitem).find("#out_game_icon").attr("src", cpappinfo.ico);
                        $(outitem).find("#out_game_addtime").text(new Date(cpappinfo.uptime).toLocaleDateString());
                        $(outitem).find("#ck_appname").val(cpappinfo.appname);
  //                      console.log(cpappinfo.downreason);
                        $(outitem).find("#out_reason").text(cpappinfo.downreason);
                        
                        console.log(cpappinfo.downreason);

                        (function (mdata: ADMIN.ADMINAPPINFO) {
                            $(outitem).find("#out_game_name").click(ev => {
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
    $("#chongxin_shangjia").click(ev => {
        var para: ADMIN.ADMINGETCHECKAPPINFOREQ = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('outgame'));
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
                console.log("成功");
                window.location.reload();
            });
        })
    });

    $("#del2").click(ev => {
        var para: ADMIN.ADMINGETCHECKAPPINFOREQ = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('outgame'));
        para.appnames = gamenames;

        ADMIN.adminGetCheckList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.ADMINCPAPPINFOREQ[] = resp.data;

            ADMIN.admindelAll(data, resp => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                console.log("成功");
                window.location.reload();
            });

        })

    });
    $("#pass").click(ev => {
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
                console.log("成功");
                window.location.reload();
            });
        })
    });
    $("#del").click(ev => {
        var para: ADMIN.ADMINGETCHECKAPPINFOREQ = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('nshgame'));
        para.appnames = gamenames;

        ADMIN.adminGetCheckList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.ADMINCPAPPINFOREQ[] = resp.data;

            ADMIN.admindelAll(data, resp => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                console.log("成功");
                window.location.reload();
            });
        })
    });

    $("#yshdown").click(ev => {
        var para: ADMIN.ADMINGETCHECKAPPINFOREQ = new ADMIN.ADMINGETCHECKAPPINFOREQ();
        var gamenames = PUTILS_NEW.getCheckValues(document.getElementById('yshgame'));
        para.appnames = gamenames;
        //  para.downreason = $("#down_reason").val();
        ADMIN.adminGetCheckList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.ADMINCPAPPINFOREQ[] = resp.data;

            data[0].downreason = $("#down_reason").val();

            console.log($("#down_reason").val());
            ADMIN.admindownAll(data, resp => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                console.log("成功");
                window.location.reload();
            });

        })
    });
    export function loadDefData_new() {
        icofile = <any>document.getElementById("icofile");
        adfile = <any>document.getElementById("adfile");
        bannerfile = <any>document.getElementById("bannerfile");
        backfile = <any>document.getElementById("backfile");
        mode = <any>document.getElementById("game_coopration");        //合作模式
        gametype = <any>document.getElementById("game_type_input");    //游戏类型
//        cpname = <any>document.getElementById("game_getin");        //对接方
        lable = <any>document.getElementById("game_lable_input");         //游戏标签
        adimg = <any>document.getElementById("game_advert_img");          //广告图
        backimg = <any>document.getElementById("game_background");
        bannerimg = <any>document.getElementById("game_small_banner");
        icoimg = <any>document.getElementById("game_icon");        //游戏图标
        posturl = <any>document.getElementById("game_pay_back");          //支付回调
        url = <any>document.getElementById("game_addr");              //入口地址
        var num = onRand();
        $("#game_secret").text(num);
        var para = sessionStorage["ADMINCPAPPINFO"];
        if (para) {
            data = JSON.parse(para);
            $("#appappnum").text(data.appid);
        }
    }
    export function saveAppinfo_new() {
        var para = new ADMIN.ADMINAPPINFOREQ();
        para.cpid = 2;
        para.nickname = $("#game_getin").val(); 
        para.cpname = $("#game_getin").val(); 
        para.appname = $("#game_name").val();        //游戏名称
        para.intro = $("#game_descrip").val();      //游戏描述
        para.mode = mode.value;
        para.gametype = gametype.value;
        para.lable = $("#game_lable_input").val();
        para.introduction = $("#game_introduction").val();          //游戏详情介绍
        console.log(para.lable);
//        para.playcount = $("#inputmanynum").val();
//        para.recommend = 0;
//        para.appsecret = $("#appsecnum").text();
        para.posturl = $("#add_game_pay_back").val();  
        para.url = $("#add_game_addr").val();  
        para.appsecret = $("#game_secret").text();
        para.profit = $("#cp_chanrge").val();
        var files: any = [];
        var filename: string;
        if (icofile.files.length > 0) {
            files[0] = icofile.files[0];
            filename = icofile.files[0].name
            para.ico = filename.substring(filename.indexOf("."));//已appid+扩展名的方式
        } else {
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
    function onRand() {
        var chr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var num: string = "";
        for (var i = 0; i < 20; i++) {
            num += chr.substr(Math.floor(Math.random() * chr.length), 1);
        }
        //var num = Math.floor(Math.random() * 90000000000 + 10000000000).toFixed(0);
        return num;
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
    export function pushTo(appid, appname, flags) {//推送到热门以及分类
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
    export function loadData_new(appname, starts) {
        ALLGAMES_NEW.loadDefData_new();
        var m = 0;
        hotgametable = <any>document.getElementById("hotgames");
        hotgameitem = <any>document.getElementById("hotgameitems");
        recgametable = <any>document.getElementById("recgames");
        hotgameitem.style.display = "none";
        var para = new ADMIN.ADMINGETH5GAMELISTREQ();
        para.starts = starts;
        para.appname = appname;
        ADMIN.adminGetH5GameList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < hotgameitems.length; i++) {
                hotgametable.removeChild(hotgameitems[i]);
            }
            hotgameitems.splice(0);
            var dat: ADMIN.ADMINGETH5APPLISTRESP = resp.data;
            for (var i = 0; i < dat.applist.length; i++) {
                var appinfo: ADMIN.H5APPINFO = dat.applist[i];
                if (appinfo.ishot == 1) {
                    m++;
                    var hotitem: HTMLTableRowElement = <any>hotgameitem.cloneNode(true);
                    hotitem.style.display = "";
                    $(hotitem).find('#hotnum').text(m);
                    $(hotitem).find("#hotpic").attr("src", appinfo.ico);
                    $(hotitem).find('#hotappid').text(appinfo.id);
                    $(hotitem).find('#hotappname').text(appinfo.name);
                    if (!!para.starts) {
                        $(hotitem).find('#hotorderby').val(appinfo.newsort);
                    } else {
                        $(hotitem).find('#hotorderby').val(appinfo.orderby);
                    }
                    
                    $(hotitem).find('#create_time').text(new Date(appinfo.createtime).toLocaleDateString());

                    (function (mdata: ADMIN.H5APPINFO) {
                        $(hotitem).find("#hotorderby").attr("onkeydown", "if (event.keyCode == 13) {KINDOFGAME.sortInsert_new(" + mdata.id + ",$(this).val())}");
                        $(hotitem).find("#hottop").click(ev => {
                            if (window.confirm("置顶(" + mdata.name + ")?")) {
                                sortClick_new(3, mdata.orderby, mdata.id, 1, null);
                            }
                        });
                        $(hotitem).find("#hotbottom").click(ev => {
                            if (window.confirm("置底(" + mdata.name + ")?")) {
                                sortClick_new(4, mdata.orderby, mdata.id, 1, null);
                            }
                        });
                        $(hotitem).find("#hotremove").click(ev => {
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





    export function loadNewgame_sort(appname, starts) {
        ALLGAMES_NEW.loadDefData_new();
        var m = 0;
        hotgametable2 = <any>document.getElementById("hotgames2");
        hotgameitem2 = <any>document.getElementById("hotgameitems2");
        recgametable = <any>document.getElementById("recgames2");
        hotgameitem2.style.display = "none";
        var para = new ADMIN.ADMINGETH5GAMELISTREQ();
        para.starts = '1';
        para.appname = appname;
        ADMIN.adminGetH5GameList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < hotgameitems2.length; i++) {
                hotgametable2.removeChild(hotgameitems2[i]);
            }
            hotgameitems2.splice(0);
            var dat: ADMIN.ADMINGETH5APPLISTRESP = resp.data;
            for (var i = 0; i < dat.applist.length; i++) {
                var appinfo: ADMIN.H5APPINFO = dat.applist[i];
                    m++;
                    var hotitem: HTMLTableRowElement = <any>hotgameitem2.cloneNode(true);
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




    export function sortInsert_new(id, sort) {
        var para: ADMIN.ADMINSORTINSERTREQ = new ADMIN.ADMINSORTINSERTREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortInsert(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }




    export function sortInsert_allgame() {
        var para: ADMIN.ADMINSORTINSERTREQ = new ADMIN.ADMINSORTINSERTREQ();
        var arr = new Array();
        $(".hotappid").each(function () {
            arr.push($(this).text());           
        });
        para.all_id = arr;


        ADMIN.adminSortInsert_allgame(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }


    export function sortInsert_newgame() {
        var para: ADMIN.ADMINSORTINSERTREQ = new ADMIN.ADMINSORTINSERTREQ();
        var arr = new Array();
        $(".hotappid2").each(function () {
            arr.push($(this).text());
        });
        para.all_id = arr;


        ADMIN.adminSortInsert_newgame(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }

    export function sortClick_new(flags, orderby, id, ishot, isrec) {
        var para: ADMIN.ADMINSORTCLICKREQ = new ADMIN.ADMINSORTCLICKREQ();
        para.flags = flags;
        para.id = id;
        para.orderby = orderby;
        para.ishot = ishot;
        para.isrec = isrec;
        ADMIN.adminSortClick(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    export function removeHotOrRec_new(flags, id) {
        var para: ADMIN.ADMINREMOVEHOTORREC = new ADMIN.ADMINREMOVEHOTORREC();
        para.flags = flags;
        para.id = id;
        ADMIN.adminRemoveHotORec(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
}