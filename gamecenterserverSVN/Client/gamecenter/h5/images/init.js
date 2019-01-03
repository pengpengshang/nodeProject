$(function setContentHeight() { //设置常用分辨率内容页的高度，暂时用着
	var height = window.screen.height;
	var width = window.screen.width;
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	var bisWx = sUserAgent.match(/MicroMessenger/i) == "micromessenger";
	var iframe = $("#rightFrame");
	var fg = $(".5wan");
	iframe.css('display', 'block');
	if(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bisWx) {
		/*$("#uswechat").css('display', 'none');
		iframe.css("width","1080px");
		iframe.attr("height", "1920px");*/
		window.top.location.href="http://5wanpk.com/gamecenter/h5/html/index.html";
	} 
})