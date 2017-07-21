import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Message, GroupMessage } from './message';
import * as firebase from 'firebase';
/* 
update funkcije su sve kao i getFn.update()
 */
@Injectable()
export class UnitsService {
     constructor( private db: AngularFireDatabase) {
    }
// get property objects
getTObject(oid){
    return this.db.object('tObjects/'+oid);
}
getObjectData(oid){
    return this.db.object('objectData/'+oid);
}
getObjectPolicies(oid){
    return this.db.object('objectPolicies/'+oid);
}
getGroupObjects(gid){
    return this.db.list('groupObjects/'+gid);

}
getMyObjects(uid){
    return this.db.object('myObjects/'+uid);
}
getGroupObjectsData(gid){
    return this.getGroupObjects(gid).map(
        objects => {
            objects.forEach(element => {
                 element.data$=this.getObjectData(element['$key']);
            });
            //return objects;
        }
    )
}
getGroupObjectsPolicies(gid){
    return this.getGroupObjects(gid).map(
        objects => {
            objects.forEach(element => {
               element.policies$=this.getObjectPolicies(element['$key']);
            });
        }
    )
}
getGroupObjectsFull(gid){
    return this.getGroupObjects(gid).flatMap(
        objects => {
            objects.forEach(element => {
                
                 //element.data$=this.getObjectData(element['$key']).merge(this.getObjectPolicies(element['$key']));
                 //element.policies$=this.getObjectPolicies(element['$key']);
                 
            });
            return objects;
        }
    )
}

getUnit(unid){
    return this.db.object('units/'+unid);
}
getObjectUnits(oid){
    return this.db.list('objectUnits/'+oid);
}

getRooms(unid, rid){ // staro, nije dobro strukturirano, ima masu takvih funckija, kad zavrsis sa jedinicama prekontrolirati i pobrisati nepotrebno
    return this.db.object('unitRooms/'+rid);
}
getTObjects(){
    return this.db.list('tObjects');
}
getUnits(){
    return this.db.list('units');
}
// add new elements
// when pushing new object push key can be fetcher eg. addTObject(data).then(.. $key ...);
addTObject(data){
    return this.db.list('tObjects').push(data);
}
addUnit(data){
    return this.db.list('units').push(data);
}
addRoom(data){
     return this.db.list('rooms').push(data);
}
createUnit(oid, data){
   return this.addUnit(data).then(unit => {

        //console.log(unit);
        this.db.object('objectUnits/'+oid).update({[unit.key]:true}).then(_ => {
            console.log("object updated");
            this.db.object('unitObjects').update({[unit.key]:oid});
        }).catch( err => { console.error("T2T error - cant add unit to objectUnits:",err)});
return unit.key;    
}).catch(err=> { console.error("T2T error: - cant create unit", err)});
}
createRoom(unid, data){
    this.addRoom(data).then(room => {
        console.log(room);
        this.db.object('unitRooms/'+unid).update({[room.key]:true}).then(_ => {
            console.log("object updated");
        }).catch( err => { console.error("T2T error - cant add room to unitRooms:",err)});
    }).catch(err=> { console.error("T2T error: - cant create room", err)});
}

//update elements
updateObject(oid, data){
    return this.db.object('tObjects/'+oid).update(data);
}
updateGroupObject(gid, oid){
    return this.db.object('groupObjects/'+gid).update({[oid]:true});
}
updateMyObject(uid, oid){
    return this.db.object('myObjects/'+uid).update({[oid]:true});
}
addObjectToUser(uid, oid){
    return this.db.object('myObjects/'+uid).update({[oid]:false});
}
updateObjectData(oid, data){
    return this.db.object('objectData/'+oid).update(data);
}
updateObjectPolicies(oid, data){
    return this.db.object('objectPolicies/'+oid).update(data);
}
updateUnit(unid, data){
    return this.db.object('units/'+unid).update(data);
}


updateRoom(rid, data){
    return this.db.object('unitRooms/'+rid).update(data);
}
 

getUnitBasic(unid){
    return this.db.object('unitBasic/'+unid);

}
updateUnitBasic(unid, data){
    return this.db.object('unitBasic/'+unid).update(data);
}
 
getUnitKB(unid){
    return this.db.object('unitKB/'+unid);

}
updateUnitKB(unid, data){
    return this.db.object('unitKB/'+unid).update(data);
}   

getUnitEq(unid){
    return this.db.object('unitEq/'+unid);

}
updateUnitEq(unid, data){
    return this.db.object('unitEq/'+unid).update(data);
}
getObjectPics(oid){
    return this.db.object('objectPics/'+oid);

}
updateObjectPics(oid, data){
    return this.db.object('objectPics/'+oid).update(data);
}
getUnitPics(unid){
    return this.db.object('unitPics/'+unid);

}
updateUnitPics(unid, data){
    return this.db.object('unitPics/'+unid).update(data);
}
getUnitRooms(unid){
        return this.db.object('unitRooms/'+unid);
}
updateUnitRooms(unid, data){
    return this.db.object('unitRooms/'+unid).update(data);
}
getUnitPrices(unid){
        return this.db.object('unitPrices/'+unid);
}
updateUnitPrices(unid, data){
    return this.db.object('unitPrices/'+unid).update(data);
}
updateOverrides(unid, data){
    return this.db.object('unitOverrides/'+unid).update(data);
}
updateOverridesMulti(unid, start, end, override){
    let tmpData={};
    for (let date=start; date <= end; date=date+24*60*60*1000){
        tmpData[date]=override;
    }
    return this.db.object('unitOverrides/'+unid).update(tmpData);
}
getClosed(unid){
    return this.db.list('unitClosed/'+unid);
}
setClosed(unid, date){
    return this.db.object('unitClosed/'+unid).update({[date]:true});
}
setClosedMulti(unid, start, end){
    let tmpData={};
    for (let date=start; date <= end; date=date+24*60*60*1000){
        tmpData[date]=true;
    }
    return this.db.object('unitClosed/'+unid).update(tmpData);
}
setOpened(unid, date){
    return this.db.object('unitClosed/'+unid).update({[date]:null});
}
setOpenedMulti(unid, start, end){
    let tmpData={};
    for (let date=start; date <= end; date=date+24*60*60*1000){
        tmpData[date]=null;
    }
    return this.db.object('unitClosed/'+unid).update(tmpData);
}
getOverride(unid, date){
    return this.db.object('unitOverrides/'+unid+'/'+date);
}
getOverridesMulti(unid){
    return this.db.object('unitOverrides/'+unid);
}
deleteOverride(unid, date){
 return this.db.object('unitOverrides/'+unid).update({[date]:null});
}
deleteOverridesMulti(unid, start, end){
    let tmpData={};
    for (let date=start; date <= end; date=date+24*60*60*1000){
        tmpData[date]=null;
    }
    return this.db.object('unitOverrides/'+unid).update(tmpData);
}
setObjectReady(oid){
    
}
setUnitReady(unid){}
getMyTObjects(uid){
     return this.db.object('myTObjects/'+ uid);
}
addMyTObjects(oid, uid){
    return this.db.object('myTObjects/'+ uid).update({[oid]:true,});
}
getUnitObject(unid){
    return this.db.object('unitObjects/'+unid);
}
getFullObject(oid){
    let result:any={};
    return this.getTObject(oid).flatMap(
        objectBasic => {
            result.objectBasic=objectBasic;
            return this.getObjectData(oid).flatMap(
                objectData => {
                    result.objectData=objectData;
                    return this.getObjectPolicies(oid).flatMap(
                        objectPolicies => {
                        result.objectPolicies=objectPolicies;
                        return this.getObjectPics(oid).map(objectPics => {
                            result.objectPics=objectPics;
                            return result;
                        });
                    }
                    )

                }
            )
        }
    ); 
    
    
    

}
getFullUnidData(unid){
    let result:any={};

    return this.getUnitBasic(unid).flatMap(
        unitBasic => {
            //Object.assign(result, {unitBasic:unitBasic});
            result.unitBasic=unitBasic;
            return this.getUnitEq(unid).flatMap(
                
                unitEq => {
                result.unitEq=unitEq;
                return this.getUnitKB(unid).flatMap( unitKB => {
                    result.unitKB=unitKB;
                    return this.getUnitPics(unid).flatMap(
                        unitPics => {
                        result.unitPics=unitPics;
                        return this.getUnitRooms(unid).flatMap(
                            unitRooms =>{
                                result.unitRooms=unitRooms;
                                return this.getUnitObject(unid).map(
                                    oid => {
                                        result.oid=oid;
                                        return result
                                    }
                                );
                            });
                    });

                })

                }
            )

        }
    );
    
    
}

}
