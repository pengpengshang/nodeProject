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
        MYCOLLECT.getMyCollect();
    });
});  
module MYCOLLECT {

    var collectlist: HTMLUListElement = <any>document.getElementById("mycollect_list");
    var collectitem: HTMLLIElement = <any>collectlist.firstElementChild;
    var collectitems: HTMLLIElement[] = [];
    export function getMyCollect() {
        var para: GAMECENTER.COLLECTGAMEREQ = new GAMECENTER.COLLECTGAMEREQ();
        para.userid = GAMECENTER.userinfo.sdkuserid;
        collectitem.style.display = "none";
        for (var i = 0; i < collectitems.length; i++) {
            collectlist.removeChild(collectitems[i]);
        }
        collectitems.splice(0);
        GAMECENTER.getMyCollectGame(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.H5APPINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var gameinfo: GAMECENTER.H5APPINFO = data[i];
                var items: HTMLLIElement = <any>collectitem.cloneNode(true);
                $(items).find("#collect_ico").attr("src", gameinfo.ico);
                $(items).find("#collect_name").text(gameinfo.name);
                $(items).find("#collect_detail").text(gameinfo.detail);

                (function fun(data: GAMECENTER.H5APPINFO) {
                    $(items).find("#collect_ingame").click(ev => {
                        window.location.href = "../../gamepage.html#"+data.id
                    })


                    $(items).find("#collect_ico").click(ev => {
                        window.location.href = 'gameDetail.html?gameid=' + data.id;
                    })

                })(gameinfo)
                items.style.display = "";
                collectlist.appendChild(items);
                collectitems.push(items);
            }
        })
    }

}
