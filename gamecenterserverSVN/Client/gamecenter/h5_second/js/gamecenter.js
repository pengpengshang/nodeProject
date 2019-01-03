//还原为默认样式
function defaultSrc() {
    $(".nav-first img").each(function (index) {
        $(this).parent().removeClass("mui-active");
        switch (index) {
            case 0:
                $(this).attr("src", "../style/img/热门 平时.png");
                break;
            case 1:
                $(this).attr("src", "../style/img/新游 平时.png");
                break;
            //case 2:
               // $(this).attr("src", "../style/img/推荐 平时.png");
                //break;
            case 2:
                $(this).attr("src", "../style/img/排行榜 平时.png");
                break;
        }
    });
}
//导航点击事件
$(function () {
    var UA = navigator.userAgent, isAndroid = /android|adr/gi.test(UA), isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
    isMobile = isAndroid || isIos; // 粗略的判断
    var clickEventType;
    if (isMobile) {
        clickEventType = "touchstart";
    } else {
        clickEventType = "tap";
    }
    $(".navul").on(clickEventType, "li", function () {
        $(this).children().addClass("border_active").parent().siblings().children().removeClass("border_active")
    })
})