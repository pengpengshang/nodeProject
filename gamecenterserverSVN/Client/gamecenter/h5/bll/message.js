$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
        MYMESSAGE.getMessage();
    });
});
var MYMESSAGE;
(function (MYMESSAGE) {
    function getMessage() {
        var messagelist = document.getElementById("message_all");
        var messageitem = messagelist.firstElementChild;
        var messageitems = [];
        messageitem.style.display = "none";
        for (var i = 0; i < messageitems.length; i++) {
            messagelist.removeChild(messageitems[i]);
        }
        messageitems.splice(0);
        GAMECENTER.gsGetMessage({ loginid: GAMECENTER.userinfo.sdkloginid }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var msgInfo = dat[i];
                var items = messageitem.cloneNode(true);
                var sflags = document.createElement("sup");
                sflags.style.fontSize = "12px";
                sflags.style.color = "#0399f1";
                $(items).find("#title").text(msgInfo.title).append(sflags);
                $(items).find("#time").text(new Date(msgInfo.createtime).toLocaleDateString());
                (function fun(data) {
                    if (data.msglogid == null && data.rsld == null && data.loginid == null) {
                        $(items).find("#msgImg").attr("src", "../img/mine/xitong_wite.png").attr("class", "mailclose");
                        $(items).find("#delete").css("display", "none");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display", "");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                            $(this).closest("li").find("#msgImg").attr("src", "../img/mine/xitong_read.png").attr("class", "mailopen");
                            setMessageread(data.id, data.loginid);
                        });
                    }
                    if (data.rsld != null && data.loginid == null) {
                        $(items).find("#msgImg").attr("src", "../img/mine/xitong_read.png").attr("class", "mailopen");
                        $(items).find("#delete").css("display", "none");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display", "");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                        });
                    }
                    if (data.rsld == null && data.loginid != null) {
                        $(items).find("#msgImg").attr("src", "../img/mine/person_wite.png").attr("class", "mailclose");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display", "");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                            $(this).closest("li").find("#msgImg").attr("src", "../img/mine/person_email_read.png").attr("class", "mailopen");
                            setMessageread(data.id, data.loginid);
                        });
                    }
                    if (data.rsld != null && data.loginid != null) {
                        $(items).find("#msgImg").attr("src", "../img/mine/xitong_read.png").attr("class", "mailopen");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display", "");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                        });
                    }
                    $(items).find("#delete").click(function () {
                        $(".message_tishi").css("display", "");
                        $("#delete_message").click(function () {
                            var _this = this;
                            deleteMessage(data.id, data.loginid, function () {
                                $(_this).closest("li").remove();
                            });
                        });
                    });
                })(msgInfo);
                items.style.display = "";
                messagelist.appendChild(items);
                messageitems.push(items);
            }
        });
    }
    MYMESSAGE.getMessage = getMessage;
    function readMessage(id, loginid, title, detail, flags) {
        $("#viewtitle").text(title);
        $("#viewdetail").text(detail);
    }
    MYMESSAGE.readMessage = readMessage;
    function setMessageread(id, loginid) {
        GAMECENTER.gsSetMsgReadStatus({ id: id, loginid: GAMECENTER.userinfo.sdkloginid }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
        });
    }
    MYMESSAGE.setMessageread = setMessageread;
    function deleteMessage(id, loginid, cb) {
        GAMECENTER.gsDeleteMsg({ id: id, loginid: loginid }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, function () {
                });
                return;
            }
            cb();
        });
    }
    MYMESSAGE.deleteMessage = deleteMessage;
})(MYMESSAGE || (MYMESSAGE = {}));
//# sourceMappingURL=message.js.map