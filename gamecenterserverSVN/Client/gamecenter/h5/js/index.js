var swiper2 = new Swiper('.ceshi', {
    pagination: '.swiper-pagination',
    slidesPerView: 4.6,
    paginationClickable: true,
    spaceBetween: 10
});
//$(".lei").click(function() {
//	$(this).addClass("active").siblings().removeClass("active");
//})
$(".top_span").click(function () {

    $(".top_span").removeClass("active");
    $(".top_span").css("color", "#999999");


    $(this).addClass("active");
    $(this).css("color", "#353535");

	//$(this).addClass("open_table").parent().find("span").siblings().removeClass("open_table");
	//$(this).css("color", "#353535").parent().find("span").siblings().css("color", "#999999");
})



$(document).ready(function () {
    $(".top li").click(function() {
        var $index = $(this).index();
        $(".main > div").eq($index).show().siblings().hide();
    })

    $(".main_body4_top li").click(function() {
        $(this).css({
            "background-color": "#FABA1C",
            "color": "#353535"
        }).siblings().css({
            "background-color": "white",
            "color": "#999999"
        });
        var index = $(this).index();
        $(".main_body4_index > div").eq(index).show().siblings().hide();
    })


    $(".best_hot").click(function () {
        $("#video_start").css("display","block");
        $("#hot_video").attr("src", "../img/bz_video.mov");
        $("#hot_video").attr({
            "src": "../img/bz_video.mov",
            "loop": "loop",
            "poster": "../img/bz_feng.jpg",
        });
        $("#index_in_game").attr("href", "../../gamepage.html#266");
    })


    $(".best_new").click(function () {
        $("#video_start").css("display", "block");
        $("#hot_video").attr("src", "../img/mengdou.mov");
        $("#hot_video").attr({
            "src": "../img/mengdou.mov",
            "loop": "loop",
            "poster": "../img/mengdou.jpg",
        });
        //$("#index_in_game").attr("href", "../../gamepage.html#230");
    })
    $(".index_gift").click(function () {
        $("#video_start").css("display", "block");
        $("#hot_video").attr("src", "../img/tahuo.mov");
        $("#hot_video").attr({
            "src": "../img/tahuo.mov",
            "loop": "loop",
            "poster": "../img/tahuoxingge.jpg",
        });
        $("#index_in_game").attr("href", "../../gamepage.html#426");
    })

    $(".index_open_table").click(function () {
        $("#video_start").css("display", "block");
        $("#hot_video").attr("src", "../img/game/video.mov");
        $("#hot_video").attr({
            "src": "../img/game/video.mov",
            "loop": "loop",
            "poster": "../img/shushan.jpg",
        });
        $("#index_in_game").attr("href", "../../gamepage.html#230");
    })



    var myVideo = document.getElementsByTagName('video')[0];
    $("#video_start").click(function () {
        $("#hot_video").attr({
            "controls": "controls",
        });
        myVideo.play();
        $("#video_start").css("display", "none");
    })


	
    $(".get_gift_code").click(function () {
        $("#zhezhao").css("display","");
    })

    $(".down_app_now").click(function(){
        $(".download_app_down").css("display","");
    })

    $(".game_history p").click(function () {
        $(this).addClass("tuijian").siblings().removeClass("tuijian");
    })
    $("#tj_game").click(function () {
        $("#tj_game img").attr("src", "../img/game/tj_click.png");
        $("#history_game img").attr("src", "../img/game/play.png");
        $(".show_tj").css("display", "");
        $(".show_history").css("display", "none");
    })
    $("#history_game").click(function () {
        $("#tj_game img").attr("src", "../img/game/tj.png");
        $("#history_game img").attr("src", "../img/game/game_history.png");
        INDEX_SECOND.ShowRecentPlay();
        $(".show_history").css("display", "");
        $(".show_tj").css("display", "none");
    })

})

$(window).on('scroll', function() { //监听滚动事件
	var margin_top = $(window).scrollTop();
	$("#zhezhao").css("top",margin_top+"px");
	
	$(".download_app_down").css("top",margin_top+"px");
	
})