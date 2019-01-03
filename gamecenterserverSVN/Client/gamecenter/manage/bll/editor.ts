$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        EDITOR_NEW.loadDefData_new();
    });
});
module EDITOR_NEW {
    var data: ADMIN.ADMINAPPINFO;
    var icofile: HTMLInputElement,//
        adfile: HTMLInputElement,
        backfile: HTMLInputElement,
        bannerfile : HTMLInputElement,
        posturl: HTMLInputElement,      //支付回调地址
        cpname: HTMLInputElement,       //对接方
        url: HTMLInputElement,         //游戏地址入口
        lable: HTMLInputElement;        //游戏标签
    var mode: HTMLSelectElement,       //合作模式
        gametype: HTMLSelectElement;    //游戏类型
    var adimg: HTMLImageElement,        //广告图片
        icoimg: HTMLImageElement,     //游戏图标
        bannerimg : HTMLImageElement,
        backimg: HTMLImageElement;       //背景图标



    export function loadDefData_new() {
        icofile = <any>document.getElementById("icofile");
        adfile = <any>document.getElementById("adfile");
        backfile = <any>document.getElementById("backfile");
        bannerfile = <any>document.getElementById("bannerfile");
        mode = <any>document.getElementById("game_coopration");        //合作模式
        gametype = <any>document.getElementById("game_type_input");    //游戏类型
        cpname = <any>document.getElementById("game_getin");        //对接方
        lable = <any>document.getElementById("game_lable_input");         //游戏标签
        adimg = <any>document.getElementById("game_advert_img");          //广告图
        icoimg = <any>document.getElementById("game_icon");
        bannerimg = <any>document.getElementById("game_small_banner");
        backimg = <any>document.getElementById("game_background");        //背景
        posturl = <any>document.getElementById("game_pay_back");          //支付回调
        url = <any>document.getElementById("game_addr");              //入口地址
        var para = sessionStorage["ADMINCPAPPINFO"];
        if (para) {
            data = JSON.parse(para);
            $("#game_id").val(data.appid);
            console.log(data.appid);
            $("#game_secret").val(data.appsecret);
            $("#game_name").val(data.appname);
            $("#game_descrip").val(data.intro);
			$("#game_out").val("http://5wanpk.com/open/h5game2.html#"+data.appid);
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

    export function saveChange_new() {//保存APP的信息
        var para = new ADMIN.ADMINAPPINFOREQ();
        if (data) para.appid = data.appid;


        para.appname = $("#game_name").val();        //游戏名称
        para.intro = $("#game_descrip").val();      //游戏描述
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
        var files: any = [];
        var filename: string;
        if (icofile.files.length > 0) {
            files[0] = icofile.files[0];
            filename = icofile.files[0].name
            para.ico = data.appid + filename.substring(filename.indexOf("."));//已appid+扩展名的方式
        } else {
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
}