//联运游戏信息
module H5GAMEINFOEntity {
    export class H5GAMEINFO {
        id: number;
        name: string;//游戏名称
        ico: string;//游戏图标
        url: string;//游戏链接
        detail: string;//游戏描述
        opencount: number;//点击次数
        playcount: number;//多少人在玩
        createtime: number;//创建时间
        getgold: number;//点击获得金币
        orderby: number;//排序
        remark: string;//备注
        ishot: number;//热门
        isrec: number;//推荐
        hasgfit: number;//是否有礼包
        rank: number;//临时排行
    }
}