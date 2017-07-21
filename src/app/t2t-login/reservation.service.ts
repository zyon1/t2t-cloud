import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ReservationService {

  constructor(private db:AngularFireDatabase) { }

fetchUnitReservations(unid){
return this.db.list('unitReservations/'+unid);
}
fetchUserReservations(uid){
return this.db.object('myReservations/'+uid);
}
fetchReservationData(resid){
  return this.db.object('reservation/'+resid);
}
fetchGuestData(guid){
  return this.db.object('guestData/'+guid);
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
 // TODO: check reservation first before sending request
 
reservation.timestamp=firebase.database['ServerValue']['TIMESTAMP'];
 return this.db.list('guestData').push(guestData).then(gData => {
   Object.assign(reservation, {guid:gData.key});
   console.log('guestData saved');
   this.db.list('reservation').push(reservation).then(res =>
    {
      console.log('reservation saved');
      this.db.object('unitReservations/'+reservation.unid).update({[res.key]:{from:reservation.from, to:reservation.to}}).then(_ => {
        console.log('reservation added to units');
      this.db.object('myReservations/'+reservation.uid).update({[res.key]:{from:reservation.from, to:reservation.to}}).then(_=>{

        notes.forEach((note, index) => {
          console.log('pushing note');
        this.db.object('reservationNotes/'+res.key+'/'+index).update(note);  
        });
        
      });
      });
      
    }
   )
 });
}

}
