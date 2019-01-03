$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        FEEDBACK.loadFeedBack(null, null);
    });
});
module FEEDBACK {

    var data2: ADMIN.ADMINGETALLFEEDBACKINFO;

  
    var feedbacktable: HTMLTableElement;
    var feedbackitem: HTMLTableRowElement;
    var feedbackitems: HTMLTableRowElement[] = [];
    export function loadFeedBack(time, backname) {
        feedbacktable = <any>document.getElementById("feeditems");
        feedbackitem = <any>document.getElementById("feeditem");
        feedbackitem.style.display = "none";


        var para: ADMIN.ADMINGETALLFEEDBACKREQ = new ADMIN.ADMINGETALLFEEDBACKREQ();
        para.time = time;
        para.backname = backname;

        ADMIN.adminGetAllFeedBack(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < feedbackitems.length; i++) {
                feedbacktable.removeChild(feedbackitems[i]);
            }
            feedbackitems.splice(0);
            var dat: ADMIN.ADMINGETALLFEEDBACKRESP = resp.data;
            var data = dat.feedbacklist;
            for (var i = 0; i < data.length; i++) {
                var feedbackinfo: ADMIN.ADMINGETALLFEEDBACKINFO = data[i];
                var item: HTMLTableRowElement = <any>feedbackitem.cloneNode(true);
                item.style.display = "";

                $(item).find("#feed_user_input").val(feedbackinfo.id);
                $(item).find("#feed_user_input").attr('title',feedbackinfo.userid);
                $(item).find("#feed_back").text(feedbackinfo.nickname);
                $(item).find("#feed_game_name").text(feedbackinfo.userid);
                $(item).find("#feed_server").text(feedbackinfo.server);
                $(item).find("#feed_detail").text(feedbackinfo.title);    
                $(item).find("#feed_status").text(feedbackinfo.status);    
                $(item).find("#feed_createtime").text(new Date(feedbackinfo.createtime).toLocaleString());
                if (feedbackinfo.status == "已处理") {
                    $(item).find("#feed_updatetime").text(new Date(feedbackinfo.updatetime).toLocaleString());
                } else {
                    $(item).find("#feed_updatetime").text('');
                }
                if (feedbackinfo.ptype == '1') {
                    $(item).find("#feed_problem").text("游戏问题");
                } else {
                    if (feedbackinfo.ptype == '2') {
                        $(item).find("#feed_problem").text("充值问题");
                    } else {
                        $(item).find("#feed_problem").text("道具问题");
                    }
                       
                }
                feedbacktable.appendChild(item);
                feedbackitems.push(item);
               (function (mdata: ADMIN.ADMINGETALLFEEDBACKINFO) {
                   $(item).find("#feed_back").click(ev => {
                       sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                       var para2 = sessionStorage["ADMINCPAPPINFO"];
                       data2 = JSON.parse(para2);
                       $("#user").text(data2.nickname);
                       $("#date").text(new Date(feedbackinfo.createtime).toLocaleDateString());
                       $("#appname").text(data2.gname);
                       $("#server").text(data2.server);
                       $("#detail").val(data2.detail);
                       $(".game_bag").show().siblings().hide();
                       $(".glyphicon-remove").click(function () {
                           $(".game_bag").hide().siblings().show();
                       })
                    });
                     $("#del").click(ev => {
                         var para: ADMIN.ADMINGETCHECKFEEDBACKREQ = new ADMIN.ADMINGETCHECKFEEDBACKREQ();
                         var feedbackname = PUTILS_NEW.getCheckValues(document.getElementById('feeditems'));
                         para.feedbackname = feedbackname;
                         ADMIN.adminGetCheckFeedBackList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELFEEDBACK[] = resp.data;
                            
                            ADMIN.admindelFeedBack(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                   });



                     $("#deal").click(ev => {
                         var para: ADMIN.ADMINGETCHECKFEEDBACKREQ = new ADMIN.ADMINGETCHECKFEEDBACKREQ();
                         var feedbackname = PUTILS_NEW.getCheckValues_ceshi(document.getElementById('feeditems'));
                         console.log(feedbackinfo.userid);
                         $("#add_user_id").val(feedbackname[0]);
                        
                     });
                })(feedbackinfo);
            }
        });
    }



    //处理问题
    export function dealProblem() {

        var para2: ADMIN.ADMINGETCHECKFEEDBACKREQ = new ADMIN.ADMINGETCHECKFEEDBACKREQ();
        var feedbackname = PUTILS_NEW.getCheckValues(document.getElementById('feeditems'));
        console.log(feedbackname[0]);
        var para: ADMIN.ADMINADDMESSAGEREQ = new ADMIN.ADMINADDMESSAGEREQ();
        var userinfo = utils.getCookie("ADMINUSERINFO");
        para.id = feedbackname[0];
        console.log(para.id);
        para.loginname = $("#add_user_id").val();
        para.title = $("#add_message_title").val();
        para.detail = $("#add_message_detail").val();
        para.sender = userinfo.nickname;
        console.log(para);
        ADMIN.adminDealProblem(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }



}    