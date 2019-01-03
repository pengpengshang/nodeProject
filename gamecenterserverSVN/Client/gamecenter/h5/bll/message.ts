$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "login.html";
            });
            return;
        }
        MYMESSAGE.getMessage();
    });
});
module MYMESSAGE {
    export function getMessage() {//加载消息列表
        var messagelist: HTMLUListElement = <any>document.getElementById("message_all");
        var messageitem: HTMLLIElement = <any>messagelist.firstElementChild;
        var messageitems: HTMLLIElement[] = [];
        messageitem.style.display = "none";
        for (var i = 0; i < messageitems.length; i++) {
            messagelist.removeChild(messageitems[i]);
        }
        messageitems.splice(0);
        GAMECENTER.gsGetMessage({ loginid: GAMECENTER.userinfo.sdkloginid }, resp => {//获取消息列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSGETMESSAGEINFO[] = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var msgInfo: GAMECENTER.GSGETMESSAGEINFO = dat[i];
                var items: HTMLLIElement = <any>messageitem.cloneNode(true);
                var sflags = document.createElement("sup");
                sflags.style.fontSize = "12px";
                sflags.style.color = "#0399f1";
                $(items).find("#title").text(msgInfo.title).append(sflags);
                $(items).find("#time").text(new Date(msgInfo.createtime).toLocaleDateString());
                (function fun(data: GAMECENTER.GSGETMESSAGEINFO) {
                    if (data.msglogid == null && data.rsld == null && data.loginid == null) { //系统未读取的消息
                        $(items).find("#msgImg").attr("src", "../img/mine/xitong_wite.png").attr("class", "mailclose");
                        $(items).find("#delete").css("display","none");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display","");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                            $(this).closest("li").find("#msgImg").attr("src", "../img/mine/xitong_read.png").attr("class", "mailopen");
                            setMessageread(data.id,data.loginid);
                        });
                    }
                    if (data.rsld != null && data.loginid == null) {//系统已经读取的消息
                        $(items).find("#msgImg").attr("src", "../img/mine/xitong_read.png").attr("class", "mailopen");
                        $(items).find("#delete").css("display", "none");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display", "");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                        });
                    }
                    if ( data.rsld == null && data.loginid != null) { //个人未读取的消息
                        $(items).find("#msgImg").attr("src", "../img/mine/person_wite.png").attr("class", "mailclose");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display", "");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                            $(this).closest("li").find("#msgImg").attr("src", "../img/mine/person_email_read.png").attr("class", "mailopen");
                            setMessageread(data.id, data.loginid);
                        });
                    }
                    if (data.rsld != null && data.loginid != null ) {//个人已读消息
                        $(items).find("#msgImg").attr("src", "../img/mine/xitong_read.png").attr("class", "mailopen");
                        $(items).find("#msgImg").click(function () {
                            $(".message_show").css("display", "");
                            readMessage(data.id, data.loginid, data.title, data.detail, $(this).closest("li").find("#newFlag").text());
                        });
                    }
                    $(items).find("#delete").click(function () {
                        $(".message_tishi").css("display", "");
                        $("#delete_message").click(function () {
                            deleteMessage(data.id, data.loginid, () => {
                                $(this).closest("li").remove();
                            });
                           
                        })
                           
                    });
                })(msgInfo)
                items.style.display = "";
                messagelist.appendChild(items);
                messageitems.push(items);
            }
        });
    }
    export function readMessage(id, loginid, title, detail, flags) {//消息读取,并设置阅读状态
        $("#viewtitle").text(title);
        $("#viewdetail").text(detail);
    }
    export function setMessageread( id,loginid) {
        GAMECENTER.gsSetMsgReadStatus({ id: id, loginid: GAMECENTER.userinfo.sdkloginid }, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
        });
    }
    export function deleteMessage(id, loginid, cb) {//删除消息
        GAMECENTER.gsDeleteMsg({ id: id, loginid: loginid }, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message, function () {
                });
                return;
            }
            cb();
        });
    }

}