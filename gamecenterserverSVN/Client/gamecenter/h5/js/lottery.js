$(function() {
	var rotateTimeOut = function() {
		$('#rotate').rotate({
			angle: 0,
			animateTo: 2160,
			duration: 8000,
			callback: function() {
				alert('网络超时，请检查您的网络设置！');
			}
		});
	};
	var bRotate = false;
	var flag = 1;
	var rotateFn = function(awards, angles, txt) {
		bRotate = !bRotate;
		$('#rotate').stopRotate();
		$('#rotate').rotate({
			angle: 0,
			animateTo: angles + 1800,
			duration: 8000,
			callback: function() {
				switch(txt){
				    case "遗憾错过":
				        utils.dialogBox("遗憾错过");
				        flag = 1;
					    break;
				    case "顽皮小5":
				        LOTTERY.addtolist("顽皮小5");
						$(".tanchuang_zhezhao").css("display", "");
						$("#jiangli_get").text(txt);
						$("#cash").attr("src","../img/lottery/cash.png");
						$("#money").text("5元现金");
						flag = 1;
						break;
				    case "甜心小5":
				        LOTTERY.addtolist("甜心小5");
						$(".tanchuang_zhezhao").css("display", "");
						$("#jiangli_get").text(txt);
						$("#cash").attr("src","../img/lottery/cash.png");
						$("#money").text("10元现金");
						flag = 1;
						break;
				    case "10积分":
				        LOTTERY.addtolist("10积分");
						$(".tanchuang_zhezhao").css("display", "");
						$("#jiangli_get").text(txt);
						$("#cash").attr("src", "../img/point.png");
						$("#cash").css({ "width": ".51rem", "left": "3rem" });
						$("#money").text("10积分");
						flag = 1;
						break;
				    case "100积分":
				        LOTTERY.addtolist("100积分");
						$(".tanchuang_zhezhao").css("display", "");
						$("#jiangli_get").text(txt);
						$("#cash").attr("src", "../img/point.png");
						$("#cash").css({ "width": ".51rem", "left": "3rem" });
						$("#money").text("100积分");
						flag = 1;
						break;
				    case "50积分":
				        LOTTERY.addtolist("50积分");
						$(".tanchuang_zhezhao").css("display", "");
						$("#jiangli_get").text(txt);
						$("#cash").attr("src", "../img/point.png");
						$("#cash").css({ "width": ".51rem", "left": "3rem" });
						$("#money").text("50积分");
						flag = 1;
						break;
				}
				
//				alert(txt);
				bRotate = !bRotate;
			}
		})
	};


	$('.one_play').click(function () {

	    if (flag == 1) {
	        flag = 0;
	        LOTTERY.createLottery();
	        var point = sessionStorage.getItem("point");
	        if (point != "over") {
	            if (bRotate) return;
	            var item = rnd(0, 100);
	            switch (true) {
	                case item == 101:
	                    //var angle = [26, 88, 137, 185, 235, 287, 337];
	                    rotateFn(0, 0, '甜心小5');
	                    break;
	                case item > 90 && item < 99:
	                    //var angle = [88, 137, 185, 235, 287];
	                    rotateFn(1, 58, '50积分');
	                    break;
	                case item > 50 && item < 91:
	                    //var angle = [137, 185, 235, 287];
	                    rotateFn(2, 118, '10积分');
	                    break;
	                case item == 102:
	                    //var angle = [137, 185, 235, 287];
	                    rotateFn(3, 175, '顽皮小5');
	                    break;
	                case item > 98 && item < 101:
	                    //var angle = [185, 235, 287];
	                    rotateFn(5, 296, '100积分');
	                    break;
	                    //case item >= 0 && item < 51:
	                case item >= 0 && item < 51:
	                    rotateFn(4, 237, '遗憾错过');
	                    break;
	            }
	        } else {
	            utils.dialogBox("积分不足...");
	        }
	    }
	});

	$(".share_click").click(function () {
	    utils.dialogBox("功能暂未开放，敬请期待...");
	})


});

function rnd(n, m) {
	return Math.floor(Math.random() * (m - n + 1) + n)
}