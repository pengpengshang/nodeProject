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
        MYCOLLECT.getMyCollect();
    });
});
var MYCOLLECT;
(function (MYCOLLECT) {
    var collectlist = document.getElementById("mycollect_list");
    var collectitem = collectlist.firstElementChild;
    var collectitems = [];
    function getMyCollect() {
        var para = new GAMECENTER.COLLECTGAMEREQ();
        para.userid = GAMECENTER.userinfo.sdkuserid;
        collectitem.style.display = "none";
        for (var i = 0; i < collectitems.length; i++) {
            collectlist.removeChild(collectitems[i]);
        }
        collectitems.splice(0);
        GAMECENTER.getMyCollectGame(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var gameinfo = data[i];
                var items = collectitem.cloneNode(true);
                $(items).find("#collect_ico").attr("src", gameinfo.ico);
                $(items).find("#collect_name").text(gameinfo.name);
                $(items).find("#collect_detail").text(gameinfo.detail);
                (function fun(data) {
                    $(items).find("#collect_ingame").click(function (ev) {
                        window.location.href = "../../gamepage.html#" + data.id;
                    });
                    $(items).find("#collect_ico").click(function (ev) {
                        window.location.href = 'gameDetail.html?gameid=' + data.id;
                    });
                })(gameinfo);
                items.style.display = "";
                collectlist.appendChild(items);
                collectitems.push(items);
            }
        });
    }
    MYCOLLECT.getMyCollect = getMyCollect;
})(MYCOLLECT || (MYCOLLECT = {}));
//# sourceMappingURL=myCollect.js.map