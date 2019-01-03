///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	
	GAMECENTER.UserAutoLogin(userinfo => {
		gceditpassword.LoadData();

	});
});
module gceditpassword {

	export function LoadData() {
		if (!GAMECENTER.userinfo) {
			window.location.href = "login.shtml";
			return;
		}

	}
	export function onOK() {
		var para = new GAMECENTER.GSUSERCHANGEPWDREQ();
//		para.oldpwd = $("#pwdold").val();
		var pwd1 = $("#pwdold").val();
		var pwd2 = $("#pwdnew").val();
		para.newpwd = $("#pwdnew").val();
		if (!pwd1) {
			alert("请输入新密码！");
			$("#pwdold").focus();
			return;
		}
		if (!pwd2) {
			alert("请再次输入密码！");
			$("#pwdnew").focus();
			return;
		}
		if (pwd1 != pwd2) {
			alert("两次输入密码不一致！");
			return;
		}
//		para.oldpwd = MD5UTIL.hex_md5(para.oldpwd);
		para.newpwd = MD5UTIL.hex_md5(para.newpwd);
		para.mysession = GAMECENTER.userinfo.session;
		GAMECENTER.gsUserChangePwd(para, resp => {
			if (resp.errno != 0) {
				alert(resp.message);
				return;
			}
			alert("修改成功！");
			history.back();
		});
	}

}