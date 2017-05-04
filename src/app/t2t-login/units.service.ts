import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Message, GroupMessage } from './message';
import * as firebase from 'firebase';

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
getUnitRooms(unid){
        return this.db.list('unitRooms/'+unid);
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
    this.addUnit(data).then(unit => {
        console.log(unit);
        this.db.object('objectUnits/'+oid).update({[unit.key]:true}).then(_ => {
            console.log("object updated");
        }).catch( err => { console.error("T2T error - cant add unit to objectUnits:",err)});
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
 
    
}
