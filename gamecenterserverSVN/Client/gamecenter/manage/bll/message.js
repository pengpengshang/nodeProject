$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        MESSAGE.loadMessage(null, null);
    });
});
var MESSAGE;
(function (MESSAGE) {
    var data2;
    var message_title = document.getElementById("message_title");
    var message_name = document.getElementById("message_name");
    var get_person = document.getElementById("get_person");
    var send_time = document.getElementById("send_time");
    var add_message_gettype = document.getElementById("add_message_gettype");
    var messagetable;
    var messageitem;
    var messageitems = [];
    function loadMessage(time, messagename) {
        messagetable = document.getElementById("messageitems");
        messageitem = document.getElementById("messageitem");
        messageitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLMESSAGEREQ();
        para.time = time;
        para.messagename = messagename;
        ADMIN.adminGetAllMessage(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < messageitems.length; i++) {
                messagetable.removeChild(messageitems[i]);
            }
            messageitems.splice(0);
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var messageinfo = data[i];
                var item = messageitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#message_title").val(messageinfo.title);
                $(item).find("#message_name").text(messageinfo.title);
                $(item).find("#send_time").text(new Date(messageinfo.createtime).toLocaleString());
                if (messageinfo.loginname == '' || messageinfo.loginname == null) {
                    $(item).find("#get_person").text("全站");
                }
                else {
                    $(item).find("#get_person").text(messageinfo.loginname);
                }
                messagetable.appendChild(item);
                messageitems.push(item);
                (function (mdata) {
                    $(item).find("#message_name").click(function (ev) {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        var para2 = sessionStorage["ADMINCPAPPINFO"];
                        data2 = JSON.parse(para2);
                        $("#detail_title").text(data2.title);
                        $("#message_detail").text(data2.detail);
                        $(".game_bag").show().siblings().hide();
                        $(".glyphicon-remove").click(function () {
                            $(".game_bag").hide().siblings().show();
                        });
                    });
                    $("#del").click(function (ev) {
                        var para = new ADMIN.ADMINGETCHECKMESSAGEREQ();
                        var messagename = PUTILS_NEW.getCheckValues(document.getElementById('messageitems'));
                        para.messagename = messagename;
                        ADMIN.adminGetCheckMessageList(para, function (resp) {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data = resp.data;
                            ADMIN.admindelMessage(data, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        });
                    });
                })(messageinfo);
            }
        });
    }
    MESSAGE.loadMessage = loadMessage;
    //发布消息
    function addMessage() {
        var para = new ADMIN.ADMINADDMESSAGEREQ();
        var userinfo = utils.getCookie("ADMINUSERINFO");
        para.loginname = $("#add_user_id").val();
        para.title = $("#add_message_title").val();
        para.detail = $("#add_message_detail").val();
        para.sender = userinfo.nickname;
        console.log(para);
        ADMIN.adminAddMessage(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    MESSAGE.addMessage = addMessage;
})(MESSAGE || (MESSAGE = {}));
//# sourceMappingURL=message.js.map