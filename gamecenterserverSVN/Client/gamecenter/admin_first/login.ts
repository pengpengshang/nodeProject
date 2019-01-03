///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />


$(document).ready(() => {
	adminlogin.LoadData();

});
module adminlogin {

    export function LoadData() {
		
	}
    export function onLogin() {
		var para = new ADMIN.ADMINREQBASE();
		para.loginid = $("#loginid").val();
		para.pwd = $("#pwd").val();
		ADMIN.adminLogin(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			ADMIN.userinfo = <any>para;
            utils.setCookie("ADMINUSERINFO", ADMIN.userinfo);
			history.back();
		});
	}
}