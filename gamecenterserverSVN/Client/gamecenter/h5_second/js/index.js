$(function () {
    iniPage();
    initRefresh();
    initBootom()
    setContentHeight(); 
})

function iniPage() {//页面初始化
    var Modify = document.querySelector("#Modify");
    var loginname = document.querySelector("#loginname");
    var guicon = document.querySelector("#guicon");
    var select = document.querySelector("#select");
    var headshoty = document.querySelector("#headshoty");
    var head = document.querySelector("#head");
    var system_headshot = document.querySelector("#system_headshot");
    Modify.addEventListener("click", function () {
        loginname.removeAttribute("readonly");
        loginname.focus();
        loginname.select();
    })
    $('.content').load('gamecenter.html');
    guicon.onclick = function () {
        document.getElementById('fade').style.display = 'block';
        head.style.display = "block";
    }
    select.onclick = function () {
        INDEXPAGE.onHeadClick();
    }
};

function favorite() {//搜藏按钮
    window.location.href = "qrcode.html";
}

function initRefresh() {//顶部刷新按钮
    $(".refresh").bind("tap", function () {
        $(this).animate({
            rotate: "361deg" //需要多1deg或者少1deg,刚好360deg不发挥作用
        }, 1000, function () {
            window.location.reload();
        });
    });
};

function initBootom() {//底部导航点击事件
    var UA = navigator.userAgent, isAndroid = /android|adr/gi.test(UA), isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
    isMobile = isAndroid || isIos; // 粗略的判断
    var clickEventType;
    if (isMobile) {
        clickEventType = "touchstart";
    } else {
        clickEventType = "tap";
    }
    $(".nav-second .mui-control-item").bind(clickEventType, function () {
        var hasActive = $(this).hasClass("mui-active");//判断是否处于被激活状态，false才重新加载页面
        var a_index = $(".nav-second .mui-control-item").index(this);
        defaultSrcBottom();
        switch (a_index) {
            case 0:
                $(function () {
                    $(".nav-second .mui-control-item")[0].firstElementChild.setAttribute("src", "../style/img/底部/游戏 点击.png");
                    if (hasActive == false) {
                        $(".title-center img").attr("src", "../style/img/抬头/5玩游戏字.png");
                        $(".content").load("gamecenter.html");
                    }
                    //alert("aaa");
                })
                break;
            case 1:
                $(function () {
                    $(".nav-second .mui-control-item")[1].firstElementChild.setAttribute("src", "../style/img/底部/礼包 点击.png");
                    if (hasActive == false) {
                        $(".title-center img").attr("src", "../style/img/抬头/礼包中心字.png");
                        $(".content").load("giftofbag.html");
                    }
                    //alert("bbb");
                })
                break;
            case 2:
                $(function () {
                    $(".nav-second .mui-control-item")[2].firstElementChild.setAttribute("src", "../style/img/底部/个人 点击.png");
                    if (hasActive == false) {
                        $(".title-center img").attr("src", "../style/img/抬头/个人中心字.png");
                        $(".content").load("perscenter.html");
                    };
                    //alert("ccc");
                })
                break
            case 3:
                $(function () {
                    $(".nav-second .mui-control-item")[3].firstElementChild.setAttribute("src", "../style/img/底部/搜索 点击.png");
                    //if (hasActive == false) {
                        $(".title-center img").attr("src", "../style/img/抬头/搜索字.png");
                        $(".content").load("search.html");
                    //}
                    //alert("ddd");
                })
                break;
        }
    })
}
function setContentHeight() {//设置常用分辨率内容页的高度，暂时用着
    var height = window.screen.height;
    var width = window.screen.width;
    var content = $("#content");
    var headers = $("#headers");
    var footer = $("#footer");
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
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bisWx) {
        $(".navul2 li").css("margin-left", "0");
    } else {
        if (height == 1080) {
            headers.css("-webkit-transform", "scale(0.5,0.5)");
            content.css("height", "1510px");
            footer.css("-webkit-transform", "scale(0.5,0.5)");
        } else if (height == 768) {
            headers.css("-webkit-transform", "scale(0.5,0.5)");
            content.css("height", "880px");
            footer.css("-webkit-transform", "scale(0.5,0.5)");
        } else if (height == 800) {
            headers.css("-webkit-transform", "scale(0.5,0.5)");
            content.css("height", "940px");
            footer.css("-webkit-transform", "scale(0.5,0.5)");
        }else if (height == 900) {
            headers.css("-webkit-transform", "scale(0.5,0.5)"); 
            content.css("height", "1145px");
            footer.css("-webkit-transform", "scale(0.5,0.5)");
        } else if (height == 1024) {
            headers.css("-webkit-transform", "scale(0.5,0.5)");
            content.css("height", "1430px");
            footer.css("-webkit-transform", "scale(0.5,0.5)");
        } else if (height == 600) {
            headers.css("-webkit-transform", "scale(0.5,0.5)");
            content.css("height", "545px");
            footer.css("-webkit-transform", "scale(0.5,0.5)");
        }else if(height == 1200) {
			headers.css("-webkit-transform", "scale(0.5,0.5)");
            content.css("height", "1625px");
            footer.css("-webkit-transform", "scale(0.5,0.5)");
		}
    }
   
}

function defaultSrcBottom() {//还原为默认样式
    $(".nav-second img").each(function (index) {
        $(this).parent().removeClass("mui-active");
        switch (index) {
            case 0:
                $(this).attr("src", "../style/img/底部/游戏 平时.png");
                break;
            case 1:
                $(this).attr("src", "../style/img/底部/礼包 平时.png");
                break;
            case 2:
                $(this).attr("src", "../style/img/底部/个人 平时.png");
                break;
            case 3:
                $(this).attr("src", "../style/img/底部/搜索 平时.png");
                break;
        }
    });
}