$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        EDITBAG.editGiftBag();
    });
});
module EDITBAG {
    var data: ADMIN.ADMINGETALLGIFTINFO;
    var bag_value: HTMLInputElement,//礼包价值
        gift_num: HTMLInputElement,//礼包名称
        bag_name: HTMLInputElement,//礼包名称
        top_title: HTMLInputElement,
        bag_data: HTMLInputElement,//礼包内容
        bag_gamename: HTMLSelectElement,       //礼包游戏名称
        bag_type: HTMLInputElement,
        bag_useway: HTMLInputElement;      //礼包使用方法
  //  var bag_type: HTMLSelectElement;    //礼包类型
    var para = sessionStorage["ADMINCPAPPINFO"];
    data = JSON.parse(para);


    export function editGiftBag() {//编辑礼包
        top_title = <any>document.getElementById("top_title");
        bag_value = <any>document.getElementById("bag_value");
        gift_num = <any>document.getElementById("gift_num");
        bag_name = <any>document.getElementById("bag_name");
        bag_data = <any>document.getElementById("bag_data");
        bag_useway = <any>document.getElementById("bag_useway");
        bag_gamename = <any>document.getElementById("bag_gamename");
        bag_type = <any>document.getElementById("bag_type");

        
        if (para) {
            $("#bag_data").val(data.instruction);
            $("#bag_useway").val(data.useway);
            $("#bag_name").val(data.giftname);
            $("#gift_num").val(data.giftnum);
            $("#bag_value").val(data.giftvalue);
            $("#bag_gamename").val(data.appname);
            $("#top_title").text(data.appname);
            $("#recDate3").val(new Date(data.endtime).toLocaleDateString());
            $("#gift_groupqq").val(data.groupqq);
           // utils.optionSelect(bag_type, data.gifttype);
            if (data.gifttype == 'hot') {
                $("#bag_type").val('热门礼包');
            }
            if (data.gifttype == 'new') {
                $("#bag_type").val('最新礼包');
            }
            if (data.gifttype == 'only') {
                $("#bag_type").val('独家礼包');
            }
        }
    }
    export function saveEdit() {//保存APP的信息
        var para: ADMIN.ADMINADDGIFTTYPREQ = new ADMIN.ADMINADDGIFTTYPREQ();
        para.instruction = $("#bag_data").val();
        para.giftname = $("#bag_name").val();
        para.useway = $("#bag_useway").val();
       // para.giftnum = $("#gift_num").val();
        para.gamename = $("#bag_gamename").val();
        if (bag_type.value == "热门礼包") {
            para.gametype = "hot";
        }
        if (bag_type.value == "最新礼包") {
            para.gametype = "new";
        }
        if (bag_type.value == "独家礼包") {
            para.gametype = "only";
        }
        para.giftvalue = $("#bag_value").val();
        para.endtime = $("#recDate3").val();
        para.groupqq = $("#gift_groupqq").val();
        para.id = data.id.toString();
        ADMIN.adminAddGiftType(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            console.log("修改成功");
            history.back();
        });
    }


} 