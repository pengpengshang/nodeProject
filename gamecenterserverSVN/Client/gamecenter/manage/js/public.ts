module PUTILS_NEW {
    function checkFileType(f: HTMLInputElement, limit): boolean {//检查图片类型以及大小
        if ("" == f.value) {
            alert("请上传图片");
            return false;
        } else {
            var ext = "\.(gif|jpg|png|GIF|JPG|PNG)";
            if (f.files[0].name.search(ext) == -1) {
                alert("文件类型错误，请重新上传");
                return false;
            } else {
                var filesize = Math.round(f.files[0].size / 1024 * 100) / 100;//kb
                if (filesize > limit) {
                    alert("文件大小错误，不得超过" + limit + "k");
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
    function checkPicSize(f: HTMLInputElement, img_hide: HTMLImageElement, img: HTMLImageElement, width, height) {//检查图片尺寸
        img_hide.src = utils.getFileUrl(f);
        img_hide.onload = function () {
            var imgwidth = img_hide.naturalWidth;
            var imgheight = img_hide.naturalHeight;
            if (imgwidth != width && imgheight != height) {
                alert("上传错误，图片尺寸应为" + width + "x" + height);
            } else {
                img.src = img_hide.src;
            }
        }
    }
    export function checkIconFileSize(f: HTMLInputElement, img_hide: HTMLImageElement, img: HTMLImageElement) {//图标上传检查
        if (checkFileType(f, 3096)) {
            checkPicSize(f, img_hide, img, 120, 120);
        }
    }

    export function checkBannerFileSize(f: HTMLInputElement, smalimg_hide: HTMLImageElement, img: HTMLImageElement) {//图标上传检查
        if (checkFileType(f, 3096)) {
            checkPicSize(f, smalimg_hide, img, 285, 160);
        }
    }


    export function checkBACKFileSize(f: HTMLInputElement, img_hide: HTMLImageElement, img: HTMLImageElement) {//广告宣传图上传检查
        if (checkFileType(f, 1024)) {
            checkPicSize(f, img_hide, img, 640, 1136);
        }
    }

    export function checkADFileSize(f: HTMLInputElement, img_hide: HTMLImageElement, img: HTMLImageElement) {//首页广告位1图片
        if (checkFileType(f, 1024)) {
            checkPicSize(f, img_hide, img,640,250);
        }
    }


    export function checkADbannerFileSize(f: HTMLInputElement, img_hide: HTMLImageElement, img: HTMLImageElement) {//广告宣传图上传检查
        if (checkFileType(f, 1024)) {
            checkPicSize(f, img_hide, img, 640, 130);
        }
    }



    export function checkAll(doc) {//选中所有
        var code_Values = doc.getElementsByTagName("input");
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                code_Values[i].checked = true;
            }
        }
    }

    export function cancelCheck(doc) {//取消选中
        var code_Values = doc.getElementsByTagName("input");
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                code_Values[i].checked = false;
            }
        }
    }

    export function getCheckValues(doc) {//获取选中值
        var code_Values = doc.getElementsByTagName("input");
        var items = [];
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                if (code_Values[i].checked) {
                    items.push(code_Values[i].value);
                }
            }
        }
        return items;
    }



    export function getCheckValues_ceshi(doc) {//获取选中值
        var code_Values = doc.getElementsByTagName("input");
        var items = [];
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                if (code_Values[i].checked) {
                    items.push(code_Values[i].title);
                }
            }
        }
        return items;
    }
}