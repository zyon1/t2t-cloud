import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
@Injectable()
export class DbCorrectionService {

  constructor(private db : AngularFireDatabase) {
    /*
    this.db.list('objectUnits').subscribe(objects => {
      //console.log(objects);
      objects.forEach(element => {
        console.log(element)
        this.db.list('objectUnits/'+element['$key']).subscribe(units => {
          units.forEach(unit => {
            console.log(unit['$key']);
            this.db.object('unitObjects').update({[unit['$key']]:element['$key']});
          })
        })
      });
    });
    ;
    */
   }

}
