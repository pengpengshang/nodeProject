$(document).ready(() => {

});
module INDEX_NEW {
    export function onLogin(loginid,pwd,idtype) {
        if (idtype == "请选择") {
            fglogin(loginid, pwd);
        } else if (idtype == "开发者") {
            cplogin(loginid, pwd);
        } else if (idtype == "渠道商") {
            splogin(loginid, pwd);
        } else {
            alert("请选择您的登入身份");
        }
    }
    function fglogin(loginid, password) {//5wan权限
        var para = new ADMIN.ADMINREQBASE();
        para.loginid = loginid;
        para.pwd = MD5UTIL.hex_md5(password);
        ADMIN.adminLogin(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var userinfo: ADMIN.USERINFO = new ADMIN.USERINFO();
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

    function cplogin(loginid, password) {//CP权限
        var para = new ADMIN.ADMINREQBASE();
        para.loginid = loginid;
        para.pwd = MD5UTIL.hex_md5(password);
        ADMIN.cpLogin(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            ADMIN.cpuserinfo = <any>para;
            utils.setCookie("CPUSERINFO", ADMIN.cpuserinfo);
            window.location.href = "cpIndex.html?user=" + para.loginid;
            //history.back();
        });
    }

    function splogin(loginid, password) {//SP权限
        var para = new ADMIN.ADMINREQBASE();
        para.loginid = loginid;
        para.pwd = MD5UTIL.hex_md5(password);
        ADMIN.spLogin(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            ADMIN.spuserinfo = <any>para;
            utils.setCookie("SPUSERINFO", ADMIN.spuserinfo);
            window.location.href = "spIndex.html?user=" + para.loginid;
            //history.back();
        });
    }
}