$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        MESSAGE.loadMessage(null, null);
    });
});
module MESSAGE {

    var data2: ADMIN.ADMINGETALLMESSAGEINFO;

    var message_title: HTMLInputElement = <any>document.getElementById("message_title");
    var message_name: HTMLInputElement = <any>document.getElementById("message_name");
    var get_person: HTMLInputElement = <any>document.getElementById("get_person");
    var send_time: HTMLInputElement = <any>document.getElementById("send_time");

    var add_message_gettype: HTMLSelectElement = <any>document.getElementById("add_message_gettype");
  
    var messagetable: HTMLTableElement;
    var messageitem: HTMLTableRowElement;
    var messageitems: HTMLTableRowElement[] = [];
    export function loadMessage(time, messagename) {
        messagetable = <any>document.getElementById("messageitems");
        messageitem = <any>document.getElementById("messageitem");
        messageitem.style.display = "none";


        var para: ADMIN.ADMINGETALLMESSAGEREQ = new ADMIN.ADMINGETALLMESSAGEREQ();
        para.time = time;
        para.messagename = messagename;

        ADMIN.adminGetAllMessage(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < messageitems.length; i++) {
                messagetable.removeChild(messageitems[i]);
            }
            messageitems.splice(0);
            var data: ADMIN.ADMINGETALLMESSAGEINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var messageinfo: ADMIN.ADMINGETALLMESSAGEINFO = data[i];
                var item: HTMLTableRowElement = <any>messageitem.cloneNode(true);
                item.style.display = "";

                $(item).find("#message_title").val(messageinfo.title);
                $(item).find("#message_name").text(messageinfo.title);
                
                $(item).find("#send_time").text(new Date(messageinfo.createtime).toLocaleString());
                if (messageinfo.loginname == '' || messageinfo.loginname == null) {
                    $(item).find("#get_person").text("全站");
                } else {
                    $(item).find("#get_person").text(messageinfo.loginname);
                }
                messagetable.appendChild(item);
                messageitems.push(item);
               (function (mdata: ADMIN.ADMINGETALLMESSAGEINFO) {
                   $(item).find("#message_name").click(ev => {
                       sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                       var para2 = sessionStorage["ADMINCPAPPINFO"];
                       data2 = JSON.parse(para2);
                       $("#detail_title").text(data2.title);
                       $("#message_detail").text(data2.detail);
                       $(".game_bag").show().siblings().hide();
                       $(".glyphicon-remove").click(function () {
                           $(".game_bag").hide().siblings().show();
                       })
                    });


                     $("#del").click(ev => {
                        var para: ADMIN.ADMINGETCHECKMESSAGEREQ = new ADMIN.ADMINGETCHECKMESSAGEREQ();
                        var messagename = PUTILS_NEW.getCheckValues(document.getElementById('messageitems'));
                        para.messagename = messagename;

                        ADMIN.adminGetCheckMessageList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELMESSAGE[] = resp.data;
                            ADMIN.admindelMessage(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });

                })(messageinfo);
            }
        });
    }

    //发布消息
   export function addMessage() {
       var para: ADMIN.ADMINADDMESSAGEREQ = new ADMIN.ADMINADDMESSAGEREQ();
       var userinfo = utils.getCookie("ADMINUSERINFO");
       para.loginname = $("#add_user_id").val();
       para.title = $("#add_message_title").val();
       para.detail = $("#add_message_detail").val();
       para.sender = userinfo.nickname;
        console.log(para);
        ADMIN.adminAddMessage(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }






}   