$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        GIFTBAG_NEW.loadData_new(null,null,'0');
        GIFTBAG_NEW.loadGameList_new();
        GIFTBAG_NEW.loadVipData_new(null,null,'1');
    });
});
module GIFTBAG_NEW {
    
    var addgift = document.getElementById("addgift");
    var gbname: HTMLInputElement = <any>document.getElementById("giftname_input");
    var gamename_input: HTMLSelectElement = <any>document.getElementById("gamelist");
    var gametype_input: HTMLSelectElement = <any>document.getElementById("gift_type_input");
    var introduce: HTMLInputElement = <any>document.getElementById("gift_instruce");
    var value: HTMLInputElement = <any>document.getElementById("gift_value_input");
    var gbuseway: HTMLInputElement = <any>document.getElementById("gbuseway");
    var giftnum: HTMLInputElement = <any>document.getElementById("gift_num");

    var gifttable: HTMLTableElement;
    var giftitem: HTMLTableRowElement;
    var giftitems: HTMLTableRowElement[] = [];

    var vip_gifttable: HTMLTableElement;
    var vip_giftitem: HTMLTableRowElement;
    var vip_giftitems: HTMLTableRowElement[] = [];


    export function loadData_new(time,giftname,flag) {
        gifttable = <any>document.getElementById("giftitems");
        giftitem = <any>document.getElementById("giftitem");
        giftitem.style.display = "none";
        var para: ADMIN.ADMINGETALLGIFTREQ = new ADMIN.ADMINGETALLGIFTREQ();
        para.time = time;
        para.giftname = giftname;
        para.flag = flag;
        ADMIN.adminGetAllGift_new(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < giftitems.length; i++) {
                gifttable.removeChild(giftitems[i]);
            }
            giftitems.splice(0);
            var dat: ADMIN.ADMINGETALLGIFTRESP = resp.data;
            var data = dat.giftlist;
            for (var i = 0; i < data.length; i++) {
                var giftinfo: ADMIN.ADMINGETALLGIFTINFO = data[i];
                var item: HTMLTableRowElement = <any>giftitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#giftname").text(giftinfo.giftname);
                $(item).find("#gifttype").text(giftinfo.gifttype);
                $(item).find("#gamename").text(giftinfo.appname);
                $(item).find("#gfname").val(giftinfo.giftname);
                $(item).find("#createtime").text(new Date(giftinfo.createtime).toLocaleDateString());
                $(item).find("#instruction").text(giftinfo.instruction).attr("id", "instruction" + i);
                $(item).find("#giftcount").text((giftinfo.total - giftinfo.remainder) + "/" + giftinfo.total);
                $(item).find("#fillCode").attr("for", "fillIn" + i);
                $(item).find("#fillIn").attr("id", "fillIn" + i);
                $(item).find("#fillIn" + i).attr("onchange", "GIFTBAG_NEW.uploadFile_new(" + giftinfo.id + ",$(this).get(0).files[0],'" + giftinfo.giftname + "',"+giftinfo.gameid+",'"+giftinfo.appname+"')");
                gifttable.appendChild(item);
                giftitems.push(item);
                (function (mdata: ADMIN.ADMINGETALLGIFTINFO) {
                    $(item).find("#giftname").click(ev => {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        window.location.href = "editGiftbag.html";
                    });


                    $("#del").click(ev => {
                        var para: ADMIN.ADMINGETCHECKGIFTBAGREQ = new ADMIN.ADMINGETCHECKGIFTBAGREQ();
                        var giftname = PUTILS_NEW.getCheckValues(document.getElementById('giftitems'));
                        para.giftname = giftname;

                        ADMIN.adminGetCheckBagList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELGIFTBAG[] = resp.data;
                            ADMIN.admindelBAG(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });

                })(giftinfo);
            }
        });
    }



    export function loadVipData_new(time, giftname,flag) {
        vip_gifttable = <any>document.getElementById("vip_giftitems");
        vip_giftitem = <any>document.getElementById("vip_giftitem");
        vip_giftitem.style.display = "none";
        var para: ADMIN.ADMINGETALLGIFTREQ = new ADMIN.ADMINGETALLGIFTREQ();
        para.time = time;
        para.giftname = giftname;
        para.flag = flag;
        ADMIN.adminGetAllGift_new(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < vip_giftitems.length; i++) {
                vip_gifttable.removeChild(vip_giftitems[i]);
            }
            vip_giftitems.splice(0);
            var dat: ADMIN.ADMINGETALLGIFTRESP = resp.data;
            var data = dat.giftlist;
            for (var i = 0; i < data.length; i++) {
                var giftinfo: ADMIN.ADMINGETALLGIFTINFO = data[i];
                var item: HTMLTableRowElement = <any>vip_giftitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#vip_giftname").text(giftinfo.giftname);
                $(item).find("#vip_gfname").val(giftinfo.giftname);
                $(item).find("#vip_gamename").text(giftinfo.appname);

                if (giftinfo.gifttype=='1') {
                    $(item).find("#vip_gifttype").text('专属礼包');
                }
                if (giftinfo.gifttype == '2') {
                    $(item).find("#vip_gifttype").text('豪华礼包');
                }
                if (giftinfo.gifttype == '3') {
                    $(item).find("#vip_gifttype").text('至尊礼包');
                }
                $(item).find("#vip_createtime").text(new Date(giftinfo.createtime).toLocaleDateString());
                $(item).find("#vip_giftcount").text((giftinfo.total - giftinfo.remainder) + "/" + giftinfo.total);
                $(item).find("#vip_fillCode").attr("for", "vip_fillIn" + i);
                $(item).find("#vip_fillIn").attr("id", "vip_fillIn" + i);
                $(item).find("#vip_fillIn" + i).attr("onchange", "GIFTBAG_NEW.uploadFile_vip(" + giftinfo.id + ",$(this).get(0).files[0],'" + giftinfo.giftname + "'," + giftinfo.gameid + ",'" + giftinfo.appname + "')");
                vip_gifttable.appendChild(item);
                vip_giftitems.push(item);
                (function (mdata: ADMIN.ADMINGETALLGIFTINFO) {
                    $(item).find("#vip_giftname").click(ev => {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        window.location.href = "editGiftbag.html";
                    });

                    $("#del2").click(ev => {
                        var para: ADMIN.ADMINGETCHECKGIFTBAGREQ = new ADMIN.ADMINGETCHECKGIFTBAGREQ();
                        var giftname = PUTILS_NEW.getCheckValues(document.getElementById('vip_giftitems'));
                        para.giftname = giftname;
                        console.log(para.giftname);
                        ADMIN.adminGetCheckBagList_vip(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELGIFTBAG[] = resp.data;
                            ADMIN.admindelBAG_vip(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });

                })(giftinfo);
            }
        });
    }










    export function addGiftBag_new() {//添加礼包
        var list_game = $("#gamelist option:selected");
        var para: ADMIN.ADMINADDGIFTTYPREQ = new ADMIN.ADMINADDGIFTTYPREQ();
        para.gamename = list_game.text();
        console.log(para.gamename );
        para.giftname = gbname.value;
        para.instruction = introduce.value;
        para.useway = gbuseway.value;
        para.endtime = $("#recDate3").val();
        para.groupqq = $("#gift_groupqq").val();
        para.gametype = gametype_input.value;
        para.giftvalue = value.value;
      //  para.giftnum = giftnum.value;
        console.log(para);
        ADMIN.adminAddGiftType(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }




    export function loadGameList_new() {//加载游戏列表
        var selh5game: HTMLSelectElement = <any>document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            var h5applist: GAMECENTER.H5APPINFO[] = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
        }

    export function uploadFile_new(typeid, file, giftname,gameid,gamename) {//上传礼包码文件
        var para: ADMIN.ADMINUPLOADFILE = new ADMIN.ADMINUPLOADFILE();
        para.typeid = typeid;
        para.gameid = gameid;
        para.gamename = gamename;
        para.giftname = giftname;
        ADMIN.adminUploadFile(para, file, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("导入成功");
            window.location.href = window.location.href;
        });
    }

    export function uploadFile_vip(typeid, file, giftname, gameid, gamename) {//上传礼包码文件
        var para: ADMIN.ADMINUPLOADFILE = new ADMIN.ADMINUPLOADFILE();
        para.typeid = typeid;
        para.gameid = gameid;
        para.gamename = gamename;
        para.giftname = giftname;
        ADMIN.adminUploadFile_vip(para, file, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("导入成功");
            window.location.href = window.location.href;
        });
    }
}