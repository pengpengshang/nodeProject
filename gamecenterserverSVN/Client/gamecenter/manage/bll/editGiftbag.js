$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        EDITBAG.editGiftBag();
    });
});
var EDITBAG;
(function (EDITBAG) {
    var data;
    var bag_value, //礼包价值
    gift_num, //礼包名称
    bag_name, //礼包名称
    top_title, bag_data, //礼包内容
    bag_gamename, //礼包游戏名称
    bag_type, bag_useway; //礼包使用方法
    //  var bag_type: HTMLSelectElement;    //礼包类型
    var para = sessionStorage["ADMINCPAPPINFO"];
    data = JSON.parse(para);
    function editGiftBag() {
        top_title = document.getElementById("top_title");
        bag_value = document.getElementById("bag_value");
        gift_num = document.getElementById("gift_num");
        bag_name = document.getElementById("bag_name");
        bag_data = document.getElementById("bag_data");
        bag_useway = document.getElementById("bag_useway");
        bag_gamename = document.getElementById("bag_gamename");
        bag_type = document.getElementById("bag_type");
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
    EDITBAG.editGiftBag = editGiftBag;
    function saveEdit() {
        var para = new ADMIN.ADMINADDGIFTTYPREQ();
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
        ADMIN.adminAddGiftType(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            console.log("修改成功");
            history.back();
        });
    }
    EDITBAG.saveEdit = saveEdit;
})(EDITBAG || (EDITBAG = {}));
//# sourceMappingURL=editGiftbag.js.map