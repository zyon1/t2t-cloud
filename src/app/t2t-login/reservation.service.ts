import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ReservationService {

  constructor(private db:AngularFireDatabase) { }

fetchUnitReservations(unid){
return this.db.object('unitReservations/'+unid);
}
fetchUserReservations(uid){
return this.db.object('myReservations/'+uid);
}
makeReservation(reservation, guestData, notes){
 /*
  {
    uid:string,
    unid:string,
   from: number,
   to: number,
   noPersons: number
  }
 */
 this.db.list('guestData').push(guestData).then(gData => {
   Object.assign(reservation, {guid:gData.key});
   this.db.list('reservation').push(reservation).then(res =>
    {
      this.db.object('unitReservations/'+reservation.unid).update({[res.key]:{from:reservation.from, to:reservation.to}}).then(_ => {
      this.db.object('myReservations/'+reservation.uid).update({[res.key]:{from:reservation.from, to:reservation.to}}).then(_=>{
        notes.forEach(note => {
        this.db.list('reservationNotes/'+res.key).push(note);  
        });
        
      });
      });
      
    }
   )
 });
}

}
