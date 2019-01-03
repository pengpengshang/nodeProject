$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        ADVERINPUT.loadData();
    });
});
var ADVERINPUT;
(function (ADVERINPUT) {
    var imgfile;
    var selh5game;
    var h5applist;
    var activity;
    var activityitem;
    var activityitems = [];
    function loadData() {
        var _this = this;
        imgfile = document.getElementById("ad_imgfile");
        selh5game = document.getElementById("ad_gnamelist");
        activity = document.getElementById("activity");
        activityitem = document.getElementById("activityitems");
        activityitem.style.display = "none";
        var para = new ADMIN.ADMINGETACTIVITYINFOSREQ();
        ADMIN.adminGetActivityInfos(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < activityitems.length; i++) {
                activity.removeChild(activityitems[i]);
            }
            activityitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var activityInfo = dat.data[i];
                var aditem = activityitem.cloneNode(true);
                aditem.style.display = "";
                $(aditem).find("#appname").val(activityInfo.gamename);
                $(aditem).find("#createtime").text(new Date(activityInfo.createtime).toLocaleDateString());
                $(aditem).find("#img").get(0)["src"] = activityInfo.img + "?" + Math.random();
                (function (mdata, item) {
                    $(aditem).find("#orderby").val(activityInfo.orderby).change(function () {
                        sortChange(mdata.id, $(this).val());
                    });
                    $(aditem).find("#get").click(function () {
                        getImgByGameName(item);
                    });
                    $(aditem).find("#save").click(function () {
                        adminSaveActivityAD(mdata.id, item);
                    });
                }).call(_this, activityInfo, aditem);
                activity.appendChild(aditem);
                activityitems.push(aditem);
            }
            //ADMIN.adminGetH5AppList({ loginid: null, pwd: null }, resp => {//获取游戏列表
            //    if (resp.errno != 0) {
            //        alert(resp.message);
            //        return;
            //    }
            //    var dat: ADMIN.ADMINGETH5APPLISTRESP = resp.data;
            //    h5applist = dat.applist;
            //    for (var i = 0; i < h5applist.length; i++) {
            //        var opt: HTMLOptionElement = document.createElement("option");
            //        opt.innerText = h5applist[i].name;
            //        opt.value = h5applist[i].id.toString();
            //        selh5game.add(opt, i);
            //    }
            //});
        });
    }
    ADVERINPUT.loadData = loadData;
    function getImgByGameName(item) {
        var para = new ADMIN.ADMINGETACTIVITYINFOIMGREQ();
        para.gamename = $(item).find("#appname").val();
        ADMIN.adminGetADImg(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $(item).find("#img").get(0)["src"] = resp.data.data + "?" + Math.random();
        });
    }
    ADVERINPUT.getImgByGameName = getImgByGameName;
    function adminSaveActivityAD(id, item) {
        var para = new ADMIN.ADMINSAVEACTIVITYINFOREQ();
        para.id = id;
        para.gamaname = $(item).find("#appname").val();
        para.orderby = $(item).find("#orderby").val();
        para.imgurl = $(item).find("#img").attr("src");
        para.flags = 0;
        ADMIN.adminSaveADInfo(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    ADVERINPUT.adminSaveActivityAD = adminSaveActivityAD;
    function sortInsert(id, sort) {
        var para = new ADMIN.ADMINSORTINSERTREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortInsertForAD(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    ADVERINPUT.sortInsert = sortInsert;
    function sortChange(id, sort) {
        var para = new ADMIN.ADMINSORTCHANGEREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortChange(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    ADVERINPUT.sortChange = sortChange;
    function adminAddActivityAD() {
        var para = new ADMIN.ADMINSAVEACTIVITYREQ();
        var selh5id = selh5game.value;
        var selh5name = selh5game.selectedOptions[0].textContent;
        para.gamename = selh5name;
        para.url = selh5id;
        para.type = 1;
        para.orderby = $("#ad_sort").val();
        var file;
        if (imgfile.files.length > 0)
            file = imgfile.files[0];
        ADMIN.adminInsertADInfo(para, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            window.location.reload();
        });
    }
    ADVERINPUT.adminAddActivityAD = adminAddActivityAD;
    function adminDelActivityAD(id) {
        var para = new ADMIN.ADMINDELACTIVITYREQ();
        para.id = id;
        ADMIN.adminDelActivity(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("删除成功");
            window.location.reload();
        });
    }
    ADVERINPUT.adminDelActivityAD = adminDelActivityAD;
})(ADVERINPUT || (ADVERINPUT = {}));
//# sourceMappingURL=adverInput.js.map