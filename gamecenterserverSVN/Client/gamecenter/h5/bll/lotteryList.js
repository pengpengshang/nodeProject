$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
        LOTTERYLIST.loadDataList();
    });
});
var LOTTERYLIST;
(function (LOTTERYLIST) {
    function loadDataList() {
        var lotterylist = document.getElementById("lottery_list");
        var lotteryitem = lotterylist.firstElementChild;
        var lotteryitems = [];
        lotteryitem.style.display = "none";
        for (var i = 0; i < lotteryitems.length; i++) {
            lotterylist.removeChild(lotteryitems[i]);
        }
        lotteryitems.splice(0);
        var para = new GAMECENTER.LOTTERYLISTREQ();
        para.userid = GAMECENTER.userinfo.sdkuserid;
        GAMECENTER.listLottery(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var lotteryinfo = data[i];
                var items = lotteryitem.cloneNode(true);
                $(items).find("#lottery_time").text(new Date(lotteryinfo.createtime).toLocaleDateString());
                $(items).find("#lottery_reword").text(lotteryinfo.reword);
                (function fun(data) {
                    $(items).find("#lottery_delete").click(function () {
                        var para2 = new GAMECENTER.LOTTERYLISTREQ();
                        para2.userid = data.id;
                        GAMECENTER.dellistLottery(para2, function (resp2) {
                            if (resp2.errno != 0) {
                                utils.dialogBox(resp2.message);
                                return;
                            }
                        });
                        $(this).parent().remove();
                    });
                })(lotteryinfo);
                items.style.display = '';
                lotterylist.appendChild(items);
                lotteryitems.push(items);
            }
        });
    }
    LOTTERYLIST.loadDataList = loadDataList;
})(LOTTERYLIST || (LOTTERYLIST = {}));
//# sourceMappingURL=lotteryList.js.map