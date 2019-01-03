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
        INTEGRAL.loadData(userinfo);
    });
});
var INTEGRAL;
(function (INTEGRAL) {
    function loadData(userinfo) {
        GAMECENTER.newMessage();
        getIntegert(userinfo);
    }
    INTEGRAL.loadData = loadData;
    function getIntegert(userinfo) {
        $("#integert_nickname").text(userinfo.nickname);
        $("#user_ico").attr("src", userinfo.headico);
        if (userinfo.email == null || userinfo.email == '') {
            $("#integral_email").attr("src", "../img/integral/point_in.png");
            $("#integral_email").click(function () {
                window.location.href = 'personInfo.html';
            });
        }
        else {
            $("#integral_email").attr("src", "../img/integral/point_yiwancheng.png");
        }
        if (userinfo.phone == null || userinfo.phone == '') {
            $("#integral_phone").attr("src", "../img/integral/point_in.png");
            $("#integral_phone").click(function () {
                window.location.href = 'personInfo.html';
            });
        }
        else {
            $("#integral_phone").attr("src", "../img/integral/point_yiwancheng.png");
        }
    }
    INTEGRAL.getIntegert = getIntegert;
})(INTEGRAL || (INTEGRAL = {}));
//# sourceMappingURL=integral.js.map