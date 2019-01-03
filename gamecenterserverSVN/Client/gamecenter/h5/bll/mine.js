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
        MINE_SECOND.loadDefaultData(userinfo);
    });
});
var MINE_SECOND;
(function (MINE_SECOND) {
    function loadDefaultData(userinfo) {
        getPersoninfo(userinfo);
        //GAMECENTER.newMessage();
    }
    MINE_SECOND.loadDefaultData = loadDefaultData;
    function getPersoninfo(userinfo) {
        $("#my_headico").attr("src", userinfo.headico);
        $("#my_nickname").text(userinfo.nickname);
        $("#my_userid").text(userinfo.sdkuserid);
    }
    MINE_SECOND.getPersoninfo = getPersoninfo;
})(MINE_SECOND || (MINE_SECOND = {}));
//# sourceMappingURL=mine.js.map