$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        SELLACCOUNT.loadAllCPGames();
    })
});
declare var XDate;
module SELLACCOUNT {
    var ctable: HTMLTableElement;
    var ctableitem: HTMLTableRowElement;
    var ctableitems: HTMLTableRowElement[] = [];
    var btable: HTMLTableElement;
    var btableitem: HTMLTableRowElement;
    var btableitems: HTMLTableRowElement[] = [];
    var bdtable: HTMLTableElement;
    var bdtableitem: HTMLTableRowElement;
    var bdtableitems: HTMLTableRowElement[] = [];
    export function loadAllCPGames() {//加载默认数据
        ctable = <any>document.getElementById("ctable");
        ctableitem = <any>document.getElementById("ctableitem");
        ctableitem.style.display = "none";
        var para: ADMIN.ADMINGETALLCPAPPLISTREQ = new ADMIN.ADMINGETALLCPAPPLISTREQ();
        para.appname = $("#stxtappname").val();
        ADMIN.adminGetAllCpAppList(para, (resp) => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < ctableitems.length; i++) {
                ctable.removeChild(ctableitems[i]);
            }
            ctableitems.splice(0);
            var dat: ADMIN.ADMINGETALLCPAPPINFO[] = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var cInfo: ADMIN.ADMINGETALLCPAPPINFO = dat[i];
                var citem: HTMLTableRowElement = <any>ctableitem.cloneNode(true);
                citem.style.display = "";
                $(citem).find("#appname").val(cInfo.appname);
                $(citem).find("#txtappname").text(cInfo.appname);
                (function (citem, info: ADMIN.ADMINGETALLCPAPPINFO) {//点击详情加载对应游戏本月对账详细单
                    $(citem).find("#detail").click(function () {
                        $("#title").text(info.appname);
                        $("#appid").val(info.appid);
                        loadBlanceDetail(info.appid);
                    });
                }).call(this, citem, cInfo);
                ctable.appendChild(citem);
                ctableitems.push(citem);
            }
        });
    }

    export function loadCheckedBlance() {//获取选中游戏的对账单信息
        btable = <any>document.getElementById("btable");
        btableitem = <any>document.getElementById("btableitem");
        btableitem.style.display = "none";
        var para: ADMIN.ADMINGETBLANCEREQ = new ADMIN.ADMINGETBLANCEREQ();
        para.games = PUTILS_NEW.getCheckValues(document.getElementById('ctable'));
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val();
        ADMIN.adminGetBlance(para, (resp) => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < btableitems.length; i++) {
                btable.removeChild(btableitems[i]);
            }
            btableitems.splice(0);
            var dat: ADMIN.ADMINBLANCEINFO[] = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var bInfo: ADMIN.ADMINBLANCEINFO = dat[i];
                var bitem: HTMLTableRowElement = <any>btableitem.cloneNode(true);
                bitem.style.display = "";
                $(bitem).find("#bappname").text(bInfo.appname);
                $(bitem).find("#bdate").text(bInfo.bdate);
                $(bitem).find("#bincome").text(bInfo.income);
                btable.appendChild(bitem);
                btableitems.push(bitem);
            }
            $(".bill").show().siblings().hide();
            $(".glyphicon-remove").click(function () {
                $(".bill").hide();
                $(".change").show();
            })
        });
    }

    export function loadBlanceDetail(appid) {
        bdtable = <any>document.getElementById("bdtable");
        bdtableitem = <any>document.getElementById("bdtableitem");
        bdtableitem.style.display = "none";
        var para: ADMIN.ADMINGETBLANCEREQ = new ADMIN.ADMINGETBLANCEREQ();
        para.appid = appid;
        para.timestart = $("#timestart2").val();
        ADMIN.adminGetBlanceDetail(para, (resp) => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < bdtableitems.length; i++) {
                bdtable.removeChild(bdtableitems[i]);
            }
            bdtableitems.splice(0);
            var dat: ADMIN.ADMINBLANCEINFO[] = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var bdInfo: ADMIN.ADMINBLANCEINFO = dat[i];
                var bditem: HTMLTableRowElement = <any>bdtableitem.cloneNode(true);
                bditem.style.display = "";
                $(bditem).find("#bddate").text(bdInfo.bdate);
                $(bditem).find("#bdincome").text(bdInfo.income);
                bdtable.appendChild(bditem);
                bdtableitems.push(bditem);
            }
            if (dat.length != 0) {
                $("#blanceImg").css("display", "");
                $("#hzimg").attr('src', dat[0].hzimg);
                $("#smimg").attr('src', dat[0].smimg);
            } else {
                $("#blanceImg").css("display", "none");
            }
            $(".game_bag").show().siblings().hide();
            $(".glyphicon-remove").click(function () {
                $(".game_bag").hide();
                $(".change").show();
                $('#timestart2').val(new XDate(new Date()).toString('yyyy-MM'));
            })
        });
    }

    export function setImgSrc(input:HTMLInputElement,img:HTMLImageElement,flags) {//设置图片路径,
        img.src = utils.getFileUrl(input);
        var para: ADMIN.ADMINUPLOADBLANCEFILEREQ = new ADMIN.ADMINUPLOADBLANCEFILEREQ();
        para.gamename = $("#title").text();
        para.gameid = $("#appid").val();
        para.addtime = $("#timestart2").val();
        para.flags = flags;
        var file = input.files[0];
        ADMIN.adminUploadBlanceFile(para, file, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("上传成功");
        });
    }
}