$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        INDEXHOTGAME.loadData();
    });
});
var INDEXHOTGAME;
(function (INDEXHOTGAME) {
    var imgfile;
    var selh5game;
    var h5applist;
    var activity;
    var activityitem;
    var activityitems = [];
    var activity_bottom;
    var activityitem_bottom;
    var activityitems_bottom = [];
    function loadData() {
        var _this = this;
        imgfile = document.getElementById("ad_imgfile");
        selh5game = document.getElementById("ad_gnamelist");
        activity = document.getElementById("activity");
        activityitem = document.getElementById("activityitems");
        activityitem.style.display = "none";
        activity_bottom = document.getElementById("activity_bottom");
        activityitem_bottom = document.getElementById("activityitems_bottom");
        activityitem_bottom.style.display = "none";
        var para = new ADMIN.ADMINGETACTIVITYINFOSREQ();
        var top_hot = [];
        var bottom_hot = [];
        ADMIN.adminGetHotGame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < activityitems.length; i++) {
                activity.removeChild(activityitems[i]);
            }
            activityitems.splice(0);
            for (var i = 0; i < activityitems_bottom.length; i++) {
                activity_bottom.removeChild(activityitems_bottom[i]);
            }
            activityitems_bottom.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                if ((dat.data[i].type).toString() == 'top') {
                    top_hot.push(dat.data[i]);
                }
                else {
                    bottom_hot.push(dat.data[i]);
                }
            }
            for (var i = 0; i < top_hot.length; i++) {
                var activityInfo = top_hot[i];
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
            for (var i = 0; i < bottom_hot.length; i++) {
                var activityInfo_bottom = bottom_hot[i];
                var aditem_bottom = activityitem_bottom.cloneNode(true);
                aditem_bottom.style.display = "";
                $(aditem_bottom).find("#appname").val(activityInfo_bottom.gamename);
                $(aditem_bottom).find("#createtime").text(new Date(activityInfo_bottom.createtime).toLocaleDateString());
                $(aditem_bottom).find("#img").get(0)["src"] = activityInfo_bottom.img + "?" + Math.random();
                (function (mdata, item) {
                    $(aditem_bottom).find("#orderby").val(activityInfo_bottom.orderby).change(function () {
                        sortChange(mdata.id, $(this).val());
                    });
                    $(aditem_bottom).find("#get_bottom").click(function () {
                        getImgByGameName(item);
                    });
                    $(aditem_bottom).find("#save_bottom").click(function () {
                        adminSaveActivityAD(mdata.id, item);
                    });
                }).call(_this, activityInfo_bottom, aditem_bottom);
                activity_bottom.appendChild(aditem_bottom);
                activityitems_bottom.push(aditem_bottom);
            }
        });
    }
    INDEXHOTGAME.loadData = loadData;
    function adminSaveActivityAD(id, item) {
        var para = new ADMIN.ADMINSAVEACTIVITYINFOREQ();
        para.id = id;
        para.gamaname = $(item).find("#appname").val();
        para.orderby = $(item).find("#orderby").val();
        para.imgurl = $(item).find("#img").attr("src");
        para.flags = 0;
        ADMIN.adminSaveHotGameInfo(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    INDEXHOTGAME.adminSaveActivityAD = adminSaveActivityAD;
    function getImgByGameName(item) {
        var para = new ADMIN.ADMINGETACTIVITYINFOIMGREQ();
        para.gamename = $(item).find("#appname").val();
        ADMIN.adminGethotgameImg(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $(item).find("#img").get(0)["src"] = resp.data.data + "?" + Math.random();
        });
    }
    INDEXHOTGAME.getImgByGameName = getImgByGameName;
    function sortChange(id, sort) {
        var para = new ADMIN.ADMINSORTCHANGEREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortHotGame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    INDEXHOTGAME.sortChange = sortChange;
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
    INDEXHOTGAME.adminAddActivityAD = adminAddActivityAD;
})(INDEXHOTGAME || (INDEXHOTGAME = {}));
//# sourceMappingURL=indexHot.js.map