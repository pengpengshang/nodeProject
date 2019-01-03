$(function () {
    var pl = document.querySelector("#phonelogin");
    var Ql = document.querySelector("#QQlogin");
    var wCL = document.querySelector("#weChatLogin");
    var currentUrl = window.location.href;
    var redirect_uri = currentUrl.substring(0, currentUrl.indexOf("html/") + 5) + "sdklogin.html";
    pl.addEventListener("click", function () {
        window.location.href = "phonelogin.html";
    })
    Ql.addEventListener("click", function () {
        window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=" + redirect_uri + "&display=mobile&state=QQ";//QQ授权
        //window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101348841&scope=get_user_info&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&display=mobile&state=QQ";//QQ授权
    })
    wCL.addEventListener("click", function () {
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=WX";//微信授权
        //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri=http://5wanpk.com/5wansdk/h5/html/sdklogin.html&response_type=code&scope=snsapi_userinfo&state=WX";
    })
})