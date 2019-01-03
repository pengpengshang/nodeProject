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
        LOTTERYLIST.loadDataList();
    });
}); 
module LOTTERYLIST {
    export function loadDataList() {
        var lotterylist: HTMLUListElement = <any>document.getElementById("lottery_list");
        var lotteryitem: HTMLLIElement = <any>lotterylist.firstElementChild;
        var lotteryitems: HTMLLIElement[] = [];
        lotteryitem.style.display = "none";
        for (var i = 0; i < lotteryitems.length; i++) {
            lotterylist.removeChild(lotteryitems[i]);
        }
        lotteryitems.splice(0);
        var para: GAMECENTER.LOTTERYLISTREQ = new GAMECENTER.LOTTERYLISTREQ();
        para.userid = GAMECENTER.userinfo.sdkuserid;
        GAMECENTER.listLottery(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.LOTTERYLISTINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var lotteryinfo: GAMECENTER.LOTTERYLISTINFO = data[i];
                var items: HTMLLIElement = <any>lotteryitem.cloneNode(true);
                $(items).find("#lottery_time").text(new Date(lotteryinfo.createtime).toLocaleDateString());
                $(items).find("#lottery_reword").text(lotteryinfo.reword);

                (function fun(data: GAMECENTER.LOTTERYLISTINFO) {
                    $(items).find("#lottery_delete").click(function () {
                        var para2: GAMECENTER.LOTTERYLISTREQ = new GAMECENTER.LOTTERYLISTREQ();
                        para2.userid = data.id;
                        GAMECENTER.dellistLottery(para2, resp2 => {
                            if (resp2.errno != 0) {
                                utils.dialogBox(resp2.message);
                                return;
                            }
                        })

                        $(this).parent().remove();

                    })
                })(lotteryinfo)

                items.style.display = '';
                lotterylist.appendChild(items);
                lotteryitems.push(items);


            }
        })

    }
}