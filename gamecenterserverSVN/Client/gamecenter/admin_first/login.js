///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    adminlogin.LoadData();
});
var adminlogin;
(function (adminlogin) {
    function LoadData() {
    }
    adminlogin.LoadData = LoadData;
    function onLogin() {
        var para = new ADMIN.ADMINREQBASE();
        para.loginid = $("#loginid").val();
        para.pwd = $("#pwd").val();
        ADMIN.adminLogin(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            ADMIN.userinfo = para;
            utils.setCookie("ADMINUSERINFO", ADMIN.userinfo);
            history.back();
        });
    }
    adminlogin.onLogin = onLogin;
})(adminlogin || (adminlogin = {}));
//# sourceMappingURL=login.js.map