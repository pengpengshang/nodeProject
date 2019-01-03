module H5LOGINFOEntity_NEW {
    export class GSUSERH5LOGINFO {
        id: number;
        userid: number;//用户ID
        createtime: number;//创建时间
        gameid: number;//游戏编号
    }
    //取得玩过的H5游戏信息列表
    export class GSUSERGETH5LOGLISTREQ {
        userid: number;
    }

    export class GSUSERH5LOGLISTRESP {
        guserh5logslist: GSUSERH5LOGINFO[];
    }
} 