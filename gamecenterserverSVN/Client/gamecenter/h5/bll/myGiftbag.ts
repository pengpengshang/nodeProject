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
        MYGIFTBAG.getMyGiftbag();
    });
});  
module MYGIFTBAG {
    export function getMyGiftbag() {
        var giftlist: HTMLUListElement = <any>document.getElementById("giftbag_list");
        var giftitem: HTMLLIElement = <any>giftlist.firstElementChild;
        var giftitems: HTMLLIElement[] = [];
        var para: GAMECENTER.GIFTBAGREQ = new GAMECENTER.GIFTBAGREQ();
        para.sdkloginid = GAMECENTER.userinfo.sdkloginid;
        giftitem.style.display = "none";
        for (var i = 0; i < giftitems.length; i++) {
            giftlist.removeChild(giftitems[i]);
        }
        giftitems.splice(0);
        GAMECENTER.getMygiftBagList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.MYGIFTBAGINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var mygifinfo: GAMECENTER.MYGIFTBAGINFO = data[i];
                var items: HTMLLIElement = <any>giftitem.cloneNode(true);
                $(items).find("#gift_ico").attr("src", mygifinfo.ico)
                $(items).find("#appname").text(mygifinfo.name);
                $(items).find("#giftname").text(mygifinfo.giftname);
                $(items).find("#gift_code").text(mygifinfo.code);

                (function fun(data: GAMECENTER.MYGIFTBAGINFO) {
                    $(items).find("#gift_detail").click(ev => {
                        $("#zhezhao").css("display", "");
                        $("#one_code").text(data.code);
                        $("#one_detail").text(data.instruction);
                        $("#one_theway").text(data.useway);
                    })
                })(mygifinfo)
                items.style.display = "";
                giftlist.appendChild(items);
                giftitems.push(items);

            }
        })
    }
}