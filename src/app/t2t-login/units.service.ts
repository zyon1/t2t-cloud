import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFire } from 'angularfire2';
import { Message, GroupMessage } from './message';
import * as firebase from 'firebase';

@Injectable()
export class UnitsService {
     constructor(private af: AngularFire) {
    }
// get property objects
getTObject(oid){
    return this.af.database.object('tObjects/'+oid);
}
getObjectData(oid){
    return this.af.database.object('objectData/'+oid);
}
getObjectPolicies(oid){
    return this.af.database.object('objectPolicies/'+oid);
}
getGroupObjects(gid){
    return this.af.database.list('groupObjects/'+gid);

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
    return this.af.database.object('units/'+unid);
}
getObjectUnits(oid){
    return this.af.database.list('objectUnits/'+oid);
}
getUnitRooms(unid){
        return this.af.database.list('unitRooms/'+unid);
}
getRooms(unid, rid){ // staro, nije dobro strukturirano, ima masu takvih funckija, kad zavrsis sa jedinicama prekontrolirati i pobrisati nepotrebno
    return this.af.database.object('unitRooms/'+rid);
}
getTObjects(){
    return this.af.database.list('tObjects');
}
getUnits(){
    return this.af.database.list('units');
}
// add new elements
// when pushing new object push key can be fetcher eg. addTObject(data).then(.. $key ...);
addTObject(data){
    return this.af.database.list('tObjects').push(data);
}
addUnit(data){
    return this.af.database.list('units').push(data);
}
addRoom(data){
     return this.af.database.list('rooms').push(data);
}
createUnit(oid, data){
    this.addUnit(data).then(unit => {
        console.log(unit);
        this.af.database.object('objectUnits/'+oid).update({[unit.key]:true}).then(_ => {
            console.log("object updated");
        }).catch( err => { console.error("T2T error - cant add unit to objectUnits:",err)});
    }).catch(err=> { console.error("T2T error: - cant create unit", err)});
}
createRoom(unid, data){
    this.addRoom(data).then(room => {
        console.log(room);
        this.af.database.object('unitRooms/'+unid).update({[room.key]:true}).then(_ => {
            console.log("object updated");
        }).catch( err => { console.error("T2T error - cant add room to unitRooms:",err)});
    }).catch(err=> { console.error("T2T error: - cant create room", err)});
}

//update elements
updateObject(oid, data){
    return this.af.database.object('tObjects/'+oid).update(data);
}
updateGroupObject(gid, oid){
    return this.af.database.object('groupObjects/'+gid).update({[oid]:true});
}
updateObjectData(oid, data){
    return this.af.database.object('objectData/'+oid).update(data);
}
updateObjectPolicies(oid, data){
    return this.af.database.object('objectPolicies/'+oid).update(data);
}
updateUnit(unid, data){
    return this.af.database.object('units/'+unid).update(data);
}
updateRoom(rid, data){
    return this.af.database.object('unitRooms/'+rid).update(data);
}
 
    
}
