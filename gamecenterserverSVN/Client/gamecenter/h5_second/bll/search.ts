$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if ((this.parent == this) || (utils.isMobileBrowser())) {
            if (userinfo == null) {
                alert("尚未登入，请先登入");
                window.location.href = "loginIndex.html"
            } else {
                SEARCH.search();
            }
        } else {
            SEARCH.search();
        }
    });
});
module SEARCH {//搜索模块
    var h5gamelist: HTMLDivElement;
    var h5gameitem: HTMLDivElement;
    var h5gameitems: HTMLDivElement[] = [];
    var testdata: HTMLDivElement;
    export function search() {//搜索初始化
        h5gamelist = <any>document.querySelector(".search_container");
        h5gameitem = <any>document.querySelector(".search_result");
        testdata = <any>document.getElementById("testdata");
        h5gameitem.style.display = "none";
        for (var i = 0; i < h5gameitems.length; i++) {//元素移除操作
            h5gamelist.removeChild(h5gameitems[i]);
        }
        h5gameitems.splice(0);
        $(".search_footer_input").bind("keydown", function (e) {//绑定回车事件
            if (e.keyCode == 13) {
                startSearch();
            }
        })
        $(".search_footer_iconSearch").bind("tap", function () {//触摸点击事件
            startSearch();
        });
    }

    function startSearch() {//搜索
        var para = $(".search_footer_input").val();
        if (!para) {
            alert("请输入需要查询的内容");
            $(".search_footer_input").focus();
            return;
        }
        GAMECENTER.gsusergeth5applistbyname(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var h5infoAddImage: GAMECENTER.H5APPINFOADDIMG[] = resp.data;
            if (h5infoAddImage.length == 0) {
                alert("查无数据！！！");
                $(".search_footer_input").val(null).focus();
                return;
            } else {
                document.querySelector(".search_footer").setAttribute("style", "display : none");
                for (var i = 0; i < h5infoAddImage.length; i++) {
                    var giftImage: HTMLImageElement = document.createElement("img");//礼包图标生成
                    giftImage.setAttribute("src", "../style/img/游戏信息/礼包图标.png");
                    giftImage.setAttribute("class", "perscenter_content_libao");
                    var item: HTMLDivElement = <any>h5gameitem.cloneNode(true);
                    var data = h5infoAddImage[i];
                    item.querySelector(".search_result_headshot")["src"] = data.ico;
                    item.querySelector(".search_result_title").textContent = data.name;
                    //item.querySelector(".search_result_pers").textContent = data.playcount.toString();
                    item.querySelector(".search_result_intro").textContent = utils.DotString(data.detail, 30);
                    item.querySelector(".search_result_intro")["title"] = data.detail;
                    if (data.hasgift == 1) {
                        item.querySelector(".search_result_title").appendChild(giftImage);
                    }
                    (function (data: GAMECENTER.H5APPINFOADDIMG) {
                        item.querySelector(".search_result_playing_nouse")["onclick"] = function (ev) {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            window.location.href = "../../gamepage.html#" + data.id;
                        }
                        item.querySelector(".search_result_headshot")["onclick"] = function (ev) { 
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            window.location.href = "../../gamepage.html#" + data.id;
                        }
                        
                    })(data);
                    item.style.display = "";
                    h5gamelist.appendChild(item);
                    h5gameitems.push(item);
                }
            }
        });
    }
}