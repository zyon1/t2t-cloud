export class Notification{
    key:string;
    uid:string;
    msg?:string;
    type:number;
    solved?:boolean;
    data:any

    constructor(key, type, uid, data? ){
        this.key=key;
        this.type=type;
        switch(type){
            case 1:
                //join group
                this.msg="Pridruži se grupi: " + data.gName + "!";
                this.data=data;
            break;
            case 2:
            this.msg="Primljena nova rezervacija za jedinicu " + this.data.unitName + "!";
            this.data=data;
            
            break;
            case 3:
            break;
            default:
            this.msg="Došlo je do pogreške!";
        }
    }

}