$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        GIFTBAG_NEW.loadData_new(null, null, '0');
        GIFTBAG_NEW.loadGameList_new();
        GIFTBAG_NEW.loadVipData_new(null, null, '1');
    });
});
var GIFTBAG_NEW;
(function (GIFTBAG_NEW) {
    var addgift = document.getElementById("addgift");
    var gbname = document.getElementById("giftname_input");
    var gamename_input = document.getElementById("gamelist");
    var gametype_input = document.getElementById("gift_type_input");
    var introduce = document.getElementById("gift_instruce");
    var value = document.getElementById("gift_value_input");
    var gbuseway = document.getElementById("gbuseway");
    var giftnum = document.getElementById("gift_num");
    var gifttable;
    var giftitem;
    var giftitems = [];
    var vip_gifttable;
    var vip_giftitem;
    var vip_giftitems = [];
    function loadData_new(time, giftname, flag) {
        gifttable = document.getElementById("giftitems");
        giftitem = document.getElementById("giftitem");
        giftitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLGIFTREQ();
        para.time = time;
        para.giftname = giftname;
        para.flag = flag;
        ADMIN.adminGetAllGift_new(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < giftitems.length; i++) {
                gifttable.removeChild(giftitems[i]);
            }
            giftitems.splice(0);
            var dat = resp.data;
            var data = dat.giftlist;
            for (var i = 0; i < data.length; i++) {
                var giftinfo = data[i];
                var item = giftitem.cloneNode(true);
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
                $(item).find("#fillIn" + i).attr("onchange", "GIFTBAG_NEW.uploadFile_new(" + giftinfo.id + ",$(this).get(0).files[0],'" + giftinfo.giftname + "'," + giftinfo.gameid + ",'" + giftinfo.appname + "')");
                gifttable.appendChild(item);
                giftitems.push(item);
                (function (mdata) {
                    $(item).find("#giftname").click(function (ev) {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        window.location.href = "editGiftbag.html";
                    });
                    $("#del").click(function (ev) {
                        var para = new ADMIN.ADMINGETCHECKGIFTBAGREQ();
                        var giftname = PUTILS_NEW.getCheckValues(document.getElementById('giftitems'));
                        para.giftname = giftname;
                        ADMIN.adminGetCheckBagList(para, function (resp) {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data = resp.data;
                            ADMIN.admindelBAG(data, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        });
                    });
                })(giftinfo);
            }
        });
    }
    GIFTBAG_NEW.loadData_new = loadData_new;
    function loadVipData_new(time, giftname, flag) {
        vip_gifttable = document.getElementById("vip_giftitems");
        vip_giftitem = document.getElementById("vip_giftitem");
        vip_giftitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLGIFTREQ();
        para.time = time;
        para.giftname = giftname;
        para.flag = flag;
        ADMIN.adminGetAllGift_new(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < vip_giftitems.length; i++) {
                vip_gifttable.removeChild(vip_giftitems[i]);
            }
            vip_giftitems.splice(0);
            var dat = resp.data;
            var data = dat.giftlist;
            for (var i = 0; i < data.length; i++) {
                var giftinfo = data[i];
                var item = vip_giftitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#vip_giftname").text(giftinfo.giftname);
                $(item).find("#vip_gfname").val(giftinfo.giftname);
                $(item).find("#vip_gamename").text(giftinfo.appname);
                if (giftinfo.gifttype == '1') {
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
                (function (mdata) {
                    $(item).find("#vip_giftname").click(function (ev) {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        window.location.href = "editGiftbag.html";
                    });
                    $("#del2").click(function (ev) {
                        var para = new ADMIN.ADMINGETCHECKGIFTBAGREQ();
                        var giftname = PUTILS_NEW.getCheckValues(document.getElementById('vip_giftitems'));
                        para.giftname = giftname;
                        console.log(para.giftname);
                        ADMIN.adminGetCheckBagList_vip(para, function (resp) {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data = resp.data;
                            ADMIN.admindelBAG_vip(data, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        });
                    });
                })(giftinfo);
            }
        });
    }
    GIFTBAG_NEW.loadVipData_new = loadVipData_new;
    function addGiftBag_new() {
        var list_game = $("#gamelist option:selected");
        var para = new ADMIN.ADMINADDGIFTTYPREQ();
        para.gamename = list_game.text();
        console.log(para.gamename);
        para.giftname = gbname.value;
        para.instruction = introduce.value;
        para.useway = gbuseway.value;
        para.endtime = $("#recDate3").val();
        para.groupqq = $("#gift_groupqq").val();
        para.gametype = gametype_input.value;
        para.giftvalue = value.value;
        //  para.giftnum = giftnum.value;
        console.log(para);
        ADMIN.adminAddGiftType(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    GIFTBAG_NEW.addGiftBag_new = addGiftBag_new;
    function loadGameList_new() {
        var selh5game = document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
            var h5applist = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
    }
    GIFTBAG_NEW.loadGameList_new = loadGameList_new;
    function uploadFile_new(typeid, file, giftname, gameid, gamename) {
        var para = new ADMIN.ADMINUPLOADFILE();
        para.typeid = typeid;
        para.gameid = gameid;
        para.gamename = gamename;
        para.giftname = giftname;
        ADMIN.adminUploadFile(para, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("导入成功");
            window.location.href = window.location.href;
        });
    }
    GIFTBAG_NEW.uploadFile_new = uploadFile_new;
    function uploadFile_vip(typeid, file, giftname, gameid, gamename) {
        var para = new ADMIN.ADMINUPLOADFILE();
        para.typeid = typeid;
        para.gameid = gameid;
        para.gamename = gamename;
        para.giftname = giftname;
        ADMIN.adminUploadFile_vip(para, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("导入成功");
            window.location.href = window.location.href;
        });
    }
    GIFTBAG_NEW.uploadFile_vip = uploadFile_vip;
})(GIFTBAG_NEW || (GIFTBAG_NEW = {}));
//# sourceMappingURL=giftbag.js.map