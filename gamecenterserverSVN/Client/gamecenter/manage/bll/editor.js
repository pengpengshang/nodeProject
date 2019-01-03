$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        EDITOR_NEW.loadDefData_new();
    });
});
var EDITOR_NEW;
(function (EDITOR_NEW) {
    var data;
    var icofile, //
    adfile, backfile, bannerfile, posturl, //支付回调地址
    cpname, //对接方
    url, //游戏地址入口
    lable; //游戏标签
    var mode, //合作模式
    gametype; //游戏类型
    var adimg, //广告图片
    icoimg, //游戏图标
    bannerimg, backimg; //背景图标
    function loadDefData_new() {
        icofile = document.getElementById("icofile");
        adfile = document.getElementById("adfile");
        backfile = document.getElementById("backfile");
        bannerfile = document.getElementById("bannerfile");
        mode = document.getElementById("game_coopration"); //合作模式
        gametype = document.getElementById("game_type_input"); //游戏类型
        cpname = document.getElementById("game_getin"); //对接方
        lable = document.getElementById("game_lable_input"); //游戏标签
        adimg = document.getElementById("game_advert_img"); //广告图
        icoimg = document.getElementById("game_icon");
        bannerimg = document.getElementById("game_small_banner");
        backimg = document.getElementById("game_background"); //背景
        posturl = document.getElementById("game_pay_back"); //支付回调
        url = document.getElementById("game_addr"); //入口地址
        var para = sessionStorage["ADMINCPAPPINFO"];
        if (para) {
            data = JSON.parse(para);
            $("#game_id").val(data.appid);
            console.log(data.appid);
            $("#game_secret").val(data.appsecret);
            $("#game_name").val(data.appname);
            $("#game_descrip").val(data.intro);
            $("#game_out").val("http://5wanpk.com/open/h5game2.html#" + data.appid);
            $("#cp_charge").val(data.profit);
            posturl.value = data.posturl;
            $("#game_introduction").val(data.introduction);
            url.value = data.url;
            cpname.value = data.nickname;
            console.log(data.lable);
            $("#game_lable_input").val(data.lable);
            // lable.value = data.lable;
            utils.optionSelect(mode, data.mode);
            utils.optionSelect(gametype, data.gametype);
            icoimg.src = data.ico + "?" + Math.random();
            adimg.src = data.adimg + "?" + Math.random();
            bannerimg.src = data.bannerimg + "?" + Math.random();
            backimg.src = data.backimg + "?" + Math.random();
        }
    }
    EDITOR_NEW.loadDefData_new = loadDefData_new;
    function saveChange_new() {
        var para = new ADMIN.ADMINAPPINFOREQ();
        if (data)
            para.appid = data.appid;
        para.appname = $("#game_name").val(); //游戏名称
        para.intro = $("#game_descrip").val(); //游戏描述
        para.mode = mode.value;
        para.gametype = gametype.value;
        para.lable = $("#game_lable_input").val();
        //        para.playcount = $("#inputmanynum").val();
        //        para.recommend = 0;
        //        para.appsecret = $("#appsecnum").text();
        para.posturl = posturl.value;
        para.url = url.value;
        para.appsecret = $("#game_secret").text();
        para.cpid = data.cpid;
        para.profit = $("#cp_charge").val();
        para.introduction = $("#game_introduction").val();
        var files = [];
        var filename;
        if (icofile.files.length > 0) {
            files[0] = icofile.files[0];
            filename = icofile.files[0].name;
            para.ico = data.appid + filename.substring(filename.indexOf(".")); //已appid+扩展名的方式
        }
        else {
            filename = icoimg.src;
            para.ico = data.appid + filename.substr(filename.indexOf("?") - 4, 4);
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
        ADMIN.adminSaveAppInfo_new(para, files, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("修改成功!");
            console.log("修改成功");
            window.location.href = "game.html";
        });
    }
    EDITOR_NEW.saveChange_new = saveChange_new;
})(EDITOR_NEW || (EDITOR_NEW = {}));
//# sourceMappingURL=editor.js.map