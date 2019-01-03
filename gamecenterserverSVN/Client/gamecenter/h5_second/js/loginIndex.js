$(function () {
    var Ql = document.querySelector("#QQLogin");
    var wCL = document.querySelector("#wechatLogin");
    var currentUrl = window.location.href;
    var redirect_uri = currentUrl.substring(0, currentUrl.indexOf("html/") + 5) + "sdklogin.html";
    Ql.addEventListener("click", function () {
        window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=" + redirect_uri + "&display=mobile&state=QQ";//QQ授权
        //window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&display=mobile&state=QQ";//QQ授权
    })
    wCL.addEventListener("click", function () {
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=WX";//微信授权
        //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&response_type=code&scope=snsapi_userinfo&state=WX";
    })
})
//将生成模板放入content中
function loadcontent(fn){
	$("#login_main").empty().append(fn);
	$("#login_main").removeClass("login-animate");
	setTimeout(function() {
			$("#login_main").addClass("login-animate");
				loadMpClickMain()
		}, 1)
}

//账号登入
function accountLogin() {
    var html = '<div class="login_acc"><i></i><input type="text" id="wUser" placeholder="请填写账号" /></div><div class="login_pass"><i></i><input type="password" id="wPwd" placeholder="请填写密码" /><a href="javascript:;" id="forgetpw">忘记密码?</a></div>';
    html+='<div class="login_mode"><a href="javascript:;" class="indexLogin" id="Wbtn" onclick="LOGININDEX_NEW.fgLogin()">登录</a><a href="javascript:;" class="wregister" id="WanRegister">没有5玩账号？点击这里立即注册</a><div class="login_way"><fieldset><legend>其他登录方式</legend></fieldset><ul><li class="phoneLogin" id="phoneLogin"></li><li class="QQLogin" id="QQLogin"></li><li class="wechatLogin" id="wechatLogin"></li></ul></div></div>'
    return html;
}
//手机登录
function phoneLogin(){
    var html = '<div class="phone"><i></i><input type="text" id="phoneNum" placeholder="请输入手机号码" pattern="[0-9]*"><a href="javascript:;" id="sendCode" onclick="LOGININDEX_NEW.sendCode(false);">获取验证码</a></div>';
	html +='<div class="phone_code"><i></i><input type="text" id="phoneCode" placeholder="请输入验证码"></div>';
	html += '<div class="login_mode2"><a href="javascript:;"  class="phonebtn" id="Wbtn" onclick="LOGININDEX_NEW.fgPhonelogin();">登录</a><a href="javascript:;" class="wword">返回登录</a></div>';
	return html;
//	$("#login_main").append(html);
}

//找回密码
function findPw(id){
    var html = '<div class="find_pw"><i></i><input type="text" id="phoneCode" placeholder="请输入验证码" /><a href="javascript:;" id="sendCode" onclick="LOGININDEX_NEW.getCode();">获取验证码</a></div>';
    html += '<div class="find_code"><i></i><input type="password" id="wPwd" placeholder="请输入密码" /></div>';
    html += '<div class="find_mode"><a href="javascript:;" class="forgetbtn" id="Wbtn" onclick="LOGININDEX_NEW.fgModifyPwd();">确定</a><a href="javascript:;" class="wword">返回登录</a></div><input type="hidden" id="loginid" value=' + id + '>';
	return html;
//	$("#login_main").append(html);
}
function modifyPw(){
	var html = '<div class="modify_account"><i></i><input type="text" id="wUser" placeholder="请填写账号" /></div>';
	html +='<div class="modifyNewPw"><i></i><input type="password" id="wPwd" placeholder="请输入新密码" /></div>';
	html += '<div class="modifyNewPwConfirm"><i></i><input type="password"  id="wconfirmPwd" placeholder="请再次输入新密码" /></div>';
	html += '<div class="modify_mode"><a href="javascript:;" class="modify" id="Wbtn">确定</a><a href="javascript:;" class="wword">返回登录</a></div>';
	return html;
//	$("#login_main").append(html);


}
//账号注册
function register(){
	var html ='<div class="res_account"><i></i><input type="text" id="wUser" placeholder="请填写账号" /></div>';
	html += '<div class="res_pw"><i></i><input type="password" id="wPwd" placeholder="请填写密码" /></div>';
	html += '<div class="res_bindPhone"><i></i><input type="text" id="phoneNum" placeholder="绑定手机(可不填)" /><a href="javascript:;" id="sendCode" onclick="LOGININDEX_NEW.sendCode(true);">获取验证码</a></div>';
	html +='<div class="res_bindcode"><i></i><input type="text" id="phoneCode" placeholder="请填写验证码" /></div>';
	html += '<div class="res_mode"><a href="javascript:;" class="register" id="Wbtn" onclick="LOGININDEX_NEW.fgReg()">注册</a><a href="javascript:;" class="wword">返回登录</a></div>';
	return html;
//	$("#login_main").append(html);
}

function closeloginBox(){
	$("#loginBox").remove();
}
//框体切换时候的加载动画
function loadanimate(fn){
    $("#login_main").empty().append(fn);
    $("#loginBox").hide().fadeIn(300, function () {
        //	$("#login_main").removeClass("login_animate");
        setTimeout(function () {
            //		$("#login_main").addClass("login_animate");
            loadClickMain();
            var Ql = document.querySelector("#QQLogin");
            var wCL = document.querySelector("#wechatLogin");
            var currentUrl = window.location.href;
            var redirect_uri = currentUrl.substring(0, currentUrl.indexOf("html/") + 5) + "sdklogin.html";
            Ql.addEventListener("click", function () {
                window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=" + redirect_uri + "&display=mobile&state=QQ";//QQ授权
                //window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&display=mobile&state=QQ";//QQ授权
            })
            wCL.addEventListener("click", function () {
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=WX";//微信授权
                //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&response_type=code&scope=snsapi_userinfo&state=WX";
            })
            var user = utils.getStorage("GSHistoryUsers", "localstorage");
            if (user != null) {
                $("#wUser").val(user[user.length - 1].sdkloginid);
            }
        }, 1)
    });
}
function loadClickMain(){
	$("#WanRegister").off().click(function(){
		loadanimate(register());
		$("#Whead").text("游戏注册");
	});
	$("#forgetpw").off().click(function () {
	    LOGININDEX_NEW.fgForgetPwd(function (id) {
	        loadanimate(findPw(id));
	        $("#Whead").text("重置密码");
	    });
	})
	$("#phoneLogin").off().click(function(){
	    loadanimate(phoneLogin());
	    $("#Whead").text("手机登入");
	})
	$("#Wbtn").off().click(function(){
		cls = $(this).attr("class");
	})
	$(".wword").off().click(function(){
	    loadanimate(accountLogin());
	    $("#Whead").text("账号登入");
	})
	//$("#Wbtn").off().click(function(){
	//	var _user = $.trim($("#wUser").val()),
	//		_pwd = $.trim($("#wPwd").val()),
	//		_smsCode = $.trim($("#phoneCode").val()),
	//		_wconfirmPwd = $.trim($("#wconfirmPwd").val()),
    //        _wPwds = $.trim($("#wPwds").val()),
    //        _wPhone = $.trim($("#phoneNum").val()),
	//		cls = $(this).attr("class");
	//		switch(cls){
	//			case "":
	//			case undefined:
	//			     mobileCheck({
	//			     	phone:_user,
	//			     	pwd:_pwd
	//			     },function(){
				     	
	//			     })
	//			 	break;
	//			case "indexLogin":
	//				mobileCheck({
	//					ygUser:_user,
	//					wpwd:_wPwds
	//				},function(){
						
	//				})
	//				break;
	//			case "phonebtn":
	//				mobileCheck({
	//				    phone: _wPhone,
	//					smsCode:_smsCode
	//				},function(){
						
	//				})
	//				break;
	//			case "forgetbtn":
	//				mobileCheck({
	//				    smsCode: _smsCode,
	//				    pwd: _pwd
	//				},function(){
	//					loadanimate(modifyPw());
	//					$("#Whead").text("找回密码");
	//				})
	//				break;
	//			case "modify":
	//				mobileCheck({
	//					ygUser:_user,
	//					pwd:_pwd,
	//					confirmPwd:_wconfirmPwd
	//				},function(){
						
	//				})
	//				break;
	//			case "register":
					//mobileCheck({
					//	ygUser:_user,
					//	pwd:_pwd
					//},function(){
						
					//})
	//		}
			
	//})
}
loadClickMain()
