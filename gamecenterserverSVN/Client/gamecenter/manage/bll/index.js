$(document).ready(function () {
});
var INDEX_NEW;
(function (INDEX_NEW) {
    function onLogin(loginid, pwd, idtype) {
        if (idtype == "请选择") {
            fglogin(loginid, pwd);
        }
        else if (idtype == "开发者") {
            cplogin(loginid, pwd);
        }
        else if (idtype == "渠道商") {
            splogin(loginid, pwd);
        }
        else {
            alert("请选择您的登入身份");
        }
    }
    INDEX_NEW.onLogin = onLogin;
    function fglogin(loginid, password) {
        var para = new ADMIN.ADMINREQBASE();
        para.loginid = loginid;
        para.pwd = MD5UTIL.hex_md5(password);
        ADMIN.adminLogin(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var userinfo = new ADMIN.USERINFO();
            userinfo.loginid = para.loginid;
            userinfo.pwd = para.pwd;
            userinfo.nickname = resp.data.data;
            ADMIN.userinfo = userinfo;
            utils.setCookie("ADMINUSERINFO", ADMIN.userinfo);
            //if ($("#select_data").val() == '平台管理') {
            window.location.href = "fgIndex.html";
            //} else {
            //    window.location.href = "fgIndexData.html";
            //}
            //history.back();
        });
    }
    function cplogin(loginid, password) {
        var para = new ADMIN.ADMINREQBASE();
        para.loginid = loginid;
        para.pwd = MD5UTIL.hex_md5(password);
        ADMIN.cpLogin(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            ADMIN.cpuserinfo = para;
            utils.setCookie("CPUSERINFO", ADMIN.cpuserinfo);
            window.location.href = "cpIndex.html?user=" + para.loginid;
            //history.back();
        });
    }
    function splogin(loginid, password) {
        var para = new ADMIN.ADMINREQBASE();
        para.loginid = loginid;
        para.pwd = MD5UTIL.hex_md5(password);
        ADMIN.spLogin(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            ADMIN.spuserinfo = para;
            utils.setCookie("SPUSERINFO", ADMIN.spuserinfo);
            window.location.href = "spIndex.html?user=" + para.loginid;
            //history.back();
        });
    }
})(INDEX_NEW || (INDEX_NEW = {}));
//# sourceMappingURL=index.js.map