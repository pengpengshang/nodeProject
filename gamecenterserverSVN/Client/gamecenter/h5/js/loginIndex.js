$(function () {
    var Ql = document.querySelector("#QQLogin");
    var wCL = document.querySelector("#wechatLogin");
    var currentUrl = window.location.href;
    var redirect_uri = currentUrl.substring(0, currentUrl.indexOf("html/") + 5) + "sdklogin.html";
    Ql.addEventListener("click", function () {
        if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
            LOGININDEX_SECOND.QQLogin();
        }else{
            window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=" + redirect_uri + "&display=mobile&state=QQ";//QQ授权
            //window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&display=mobile&state=QQ";//QQ授权
        }
    })
    wCL.addEventListener("click", function () {
        if (navigator.userAgent.indexOf("FIVEGAME") >= 0) {
            LOGININDEX_SECOND.WXLogin();
        }else{
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=WX";//微信授权
            //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&response_type=code&scope=snsapi_userinfo&state=WX";
        }
    })




    $("#Wbtn").click(function () {
        var res = verifyCode.validate(document.getElementById("code_input").value);
        if ($("#code_input").val() == '') {
            alert("请输入下方验证码！");
        } else {
            if (res) {
                LOGININDEX_SECOND.fgPhonelogin()
            } else {
                alert("验证码错误");
            }
        }
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
   var html = '<div class="login_mode">'
           html += '<div class="login_way">'
          	   html += '<img src="../style/img/login/background.png" style="height: 100%;width: 100%;" />'
          		   html += '<img src="../style/img/login/login_way.png" style="width: 43%;top: 19%;left: 31%;position: absolute;" />'                        
           		       html += '<ul style="position: relative;top: -1.4rem;">'
            			   html += '<li class="phoneLogin" id="phoneLogin"></li>'
            				   html += '<li class="QQLogin" id="QQLogin"></li>'
              			   html += '<li class="wechatLogin" id="wechatLogin"></li>'
              		   html += '</ul>'
              	   html += ' <p id="num_log" style="font-size:0.22rem;color:white;position:relative;bottom:1rem">账号登录</p>'
               html += '</div>'
           html += '</div>'
return html;
}
//手机登录
function phoneLogin(){
    var html = '<div class="phone" style="height:3.1rem;padding: 0;"><img src="../style/img/login/background.png" style="width:100%;height:100%;position: absolute;left: 0;top: 0;" />'
    html +='<div class="input_phone" style="position: absolute;top: .4rem;width: 90%;padding: 11px;border: 1px solid rgb(104,139,181);border-radius: 8px;"><img src="../style/img/login/person.png" style="height:.3rem;position: relative;top:0.06rem;" /><input type="text" id="phoneNum" style="color:white;" placeholder="请输入手机号码" pattern="[0-9]*"></div>';  
	html +='<div class="phone_code" style="position: absolute;top:1.4rem;width: 90%;padding: 11px;border: 1px solid rgb(104,139,181);border-radius: 8px;">'
	html +='<img src="../style/img/login/lock.png" style="height:.3rem;position: relative;top:0.06rem;" /><input type="text" style="width:50%;color:white;" id="phoneCode" placeholder="请输入验证码">'
	html += '<a href="javascript:;" id="sendCode" style=" color: white;border: 1px solid rgb(104,139,181);padding:4px;background-color: rgb(104,139,181);float: right;" onclick="LOGININDEX_SECOND.sendCode(true);">获取验证码</a></div>'
	html += '<div class="login_mode2" style="position: relative;top:2.2rem;width:100%;text-align: center;" >'
	html += '<img src="../style/img/login/login.png" style="margin:auto;width: 1.8rem;" class="phonebtn" id="Wbtn" onclick="LOGININDEX_SECOND.fgPhonelogin();">'
	html +='<a href="javascript:;" style="color:white;" class="wword">返回登录</a></div>'
	html +='</div>';
	return html;
//	$("#login_main").append(html);
}

//找回密码
function findPw(id){
    var html = '<div class="find_pw"><i></i><input type="text" id="phoneCode" placeholder="请输入验证码" /><a href="javascript:;" id="sendCode" onclick="LOGININDEX_SECOND.getCode();">获取验证码</a></div>';
    html += '<div class="find_code"><i></i><input type="password" id="wPwd" placeholder="请输入密码" /></div>';
    html += '<div class="find_mode"><a href="javascript:;" class="forgetbtn" id="Wbtn" onclick="LOGININDEX_SECOND.fgModifyPwd();">确定</a><a href="javascript:;" class="wword">返回登录</a></div><input type="hidden" id="loginid" value=' + id + '>';
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
	html += '<div class="res_bindPhone"><i></i><input type="text" id="phoneNum" placeholder="绑定手机(可不填)" /><a href="javascript:;" id="sendCode" onclick="LOGININDEX_SECOND.sendCode(true);">获取验证码</a></div>';
	html +='<div class="res_bindcode"><i></i><input type="text" id="phoneCode" placeholder="请填写验证码" /></div>';
	html += '<div class="res_mode"><a href="javascript:;" class="register" id="Wbtn" onclick="LOGININDEX_SECOND.fgReg()">注册</a><a href="javascript:;" class="wword">返回登录</a></div>';
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
	//$("#forgetpw").off().click(function () {
	//    LOGININDEX_NEW.fgForgetPwd(function (id) {
	//        loadanimate(findPw(id));
	//        $("#Whead").text("重置密码");
	//    });
	//})
	$("#phoneLogin").off().click(function(){
	    loadanimate(phoneLogin());
	    $("#Whead").text("手机登入");
	})
	$("#Wbtn").off().click(function(){
		cls = $(this).attr("class");
	})
	$(".wword").off().click(function(){
	    loadanimate(accountLogin());
	    $("#num_log").click(function () {
	        $('#loginBox2').fadeIn(1500);
	        $('#loginBox').fadeOut();
	    })
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
