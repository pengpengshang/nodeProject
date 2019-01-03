console.log($('#recDate').val().toString('yyyy-MM-dd'));
$(".money_search").find("span").eq(0).css("color", "#000000");
$(".money_search span").click(function () {
    $(this).css("color", "#000000");
    $(this).siblings().css("color", "#00AEEF");
    var index = $(".money_search span").index(this);
    $(".change > div").eq(index).show().siblings().hide();
    $(".change > div").eq(index).show().siblings().hide();
    $('.checkbox_all').prop("checked", false);
    $('.checkbox_child').prop("checked", false);
})
//全选or全部取消
$('.checkbox_all').click(function () {
    if ($(this).is(":checked")) {
        $('.checkbox_child').prop("checked", true);
    } else {
        $('.checkbox_child').prop("checked", false);
    }
})

$("#allgame").click(function () {
    ALLGAMES_NEW.loadallgames_new('', $('#inputname').val(), '', '', '已通过')
})
$("#shenhe").click(function () {
    ALLGAMES_NEW.loadallgames_new('', $('#inputname2').val(), '', '', '未审核')
})
$("#downgame").click(function () {
    ALLGAMES_NEW.loadallgames_new('', $('#inputname3').val(), '', '', '已下架')
})
setSlideState(".inputs");
function setSlideState(element) {
    var leng = 2;
    var arr = [];
    $(element).click(function () {
        if ($(this).is(":checked")) {
            arr.push($(this));
        } else {
            arr.pop();
        }
        if (arr.length == leng) {
            for (var i = 0; i < $(element).length; i++) {
                var cur = $(".inputs").eq(i);
                if (!cur.is(":checked")) {
                    cur.attr("disabled", "disabled");
                }
            }
        } else {
            for (var y = 0; y < $(element).length; y++) {
                var cur = $(".inputs").eq(y);
                cur.attr("disabled", false);
            }
        }
    });
}

var a = '';
$(".inputs").click(function () {
    if ($(this).is(":checked")) {
        if (a.length > 0) {
            a = a + ',' + $(this).val();
        } else {
            a = a + $(this).val();
        }
        $("#game_lable_input").val(a);
    } else {
        var b = $(this).val() + ',';
        a = a.replace($(this).val(), '');
        a = a.replace(',', '');
        console.log(a);
        $("#game_lable_input").val(a);
    }
})

$(function () {
    $('#recDate').val(new XDate(new Date()).toString('yyyy-MM-dd'));
    $('#recDate2').val(new XDate(new Date()).toString('yyyy-MM-dd'));
    $('#recDate3').val(new XDate(new Date()).toString('yyyy-MM-dd'));
    $('#rnidata').text(new XDate(new Date()).toString('yyyy-MM-dd'));
})
$("#rnitime").on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    RECHARGE.loadData($("#recDate").val(), 0);
})
$("#rniweek").on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    RECHARGE.loadData(null, 1);
})
$("#rnimonth").on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    RECHARGE.loadData(null, 2);
})
$("#rniall").on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    RECHARGE.loadData(new XDate(new Date()).toString('yyyy-MM-dd'), 3);
})
laydate({
    elem: '#recDate',
    choose: function (datas) { //选择日期完毕的回调
        $("#rnidata").text(datas);
        $("#rnitime").addClass('active').siblings().removeClass('active');
        RECHARGE.loadData(datas, 0);
    }
});
$("#rexclickdate").click(function () {
    laydate({
        elem: '#recDate',
        choose: function (datas) { //选择日期完毕的回调
            document.getElementById("recDate").value = datas;

            $("#rnidata").text(datas);
            console.log($('#rnidata').text());
            //      $("#rnitime").addClass('active').siblings().removeClass('active');

        }
    });

});
laydate({
    elem: '#recDate2',
    choose: function (datas) { //选择日期完毕的回调
        $("#rnidata2").text(datas);

        RECHARGE.loadData(datas, 0);
    }
});
$("#rexclickdate2").click(function () {
    laydate({
        elem: '#recDate2',
        choose: function (datas) { //选择日期完毕的回调
            document.getElementById("recDate").value = datas;

            $("#rnidata2").text(datas);
            console.log($('#rnidata').text());


        }
    });

});
laydate({
    elem: '#recDate3',
    choose: function (datas) { //选择日期完毕的回调
        $("#rnidata3").text(datas);

        RECHARGE.loadData(datas, 0);
    }
});
$("#rexclickdate3").click(function () {
    laydate({
        elem: '#recDate3',
        choose: function (datas) { //选择日期完毕的回调
            document.getElementById("recDate").value = datas;

            $("#rnidata3").text(datas);
            console.log($('#rnidata').text());


        }
    });

});

$("#kdfh").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    $("#kdfth").css('display', 'block');
    $("#kdfts").css('display', 'none');
});
$("#kdfs").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    $("#kdfts").css('display', 'block');
    $("#kdfth").css('display', 'none');
});
$("#starsort").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
});
$("#defaultsort").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
})


