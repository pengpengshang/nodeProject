$("#footer_game").click(function() {
	window.location.href = 'index.html';
})
$("#footer_activity").click(function() {
    window.location.href = 'activity.html';
})
$("#footer_point").click(function() {
    window.location.href = 'lottery.html';
    //utils.dialogBox("功能即将开放，敬请期待...");
})
$("#footer_ranking").click(function() {
    window.location.href = 'rechage.html';
    //utils.dialogBox("功能即将开放，敬请期待...");
})
$("#footer_mine").click(function() {
	window.location.href = 'mine.html';
})


jQuery(document).ready(function($) {
	if($("meta[name=toTop]").attr("content") == "true") {
		if($(this).scrollTop() == 0) {
			$("#toTop").hide();
		}
		$(window).scroll(function(event) {
			/* Act on the event */
			if($(this).scrollTop() == 0) {
				$("#toTop").hide();
			}
			if($(this).scrollTop() != 0) {
				$("#toTop").show();
			}
		});
		$("#toTop").click(function(event) {
			/* Act on the event */
			$("html,body").animate({
					scrollTop: "0px"
				},
				666
			)
		});
	}
});
