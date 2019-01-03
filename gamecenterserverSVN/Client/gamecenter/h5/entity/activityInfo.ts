module ActivityADEntity_NEW {
    export class ActivityAD {
        id: number;
        type: number;//0:url是一个链接，1：url是数字（H5游戏ID）
        url: any;
        img: string;
        isrec: number;
    }
}