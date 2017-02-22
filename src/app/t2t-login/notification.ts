export class Notification{
    key:string;
    gid?:string;
    gName?:string;
    uid?:string;
    msg?:string;
    type:number;
    solved?:boolean;
    constructor(key, type, gid?, gName?, uid?){
        this.key=key;
        this.type=type;
        switch(type){
            case 1:
                //join group
                this.msg="Pridruži se grupi: " + gName + "!";
                this.gName=gName;
                this.gid=gid;
            break;
            case 2:
            break;
            case 3:
            break;
            default:
            this.msg="Došlo je do pogreške!";
        }
    }
}