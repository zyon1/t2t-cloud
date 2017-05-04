import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { FirebaseAuth } from 'angularfire2';
import * as firebase from 'firebase';
@Injectable()
export class UnitsWizzardService {
  wizzardState:any={
    object:{
      osnovno: {
        available: true,
        completed: false
      },
      sadrzaji:{
        available: false,
        completed: false
      },
      politika: {
        available: false,
        completed: false
      },
      slike: {
        available: false,
        completed: false
      },
      available: true,
      completed: false,
    },
    unit:{
      dodaj: {
        available: false,
        completed: false
      },
      osnovno: {
        available: false,
        completed: false
      }, //osnovno + grijanje
      kuhinja: {
        available: false,
        completed: false
      }, // kuhinja i kupaonica
      oprema: {
        available: false,
        completed: false
      }, //oprema i multimedia
      slike: {
        available: false,
        completed: false
      },
      available: false,
      completed: false
    },
    rooms: {
      dodaj: {
        available: false,
        completed: false
      },
      soba: {
        available: false,
        completed: false
      },
      available: false,
      completed: false
    },
  prices: {
    dodaj: {
        available: false,
        completed: false
      },
    jedinica: {
        available: false,
        completed: false
      },
      available: false,
      completed: false
    }
  }
  
event$:any;
emmitter;
  constructor() {
    this.event$=Observable.create(e => this.emmitter = e);
   // this.wizzardState.foreach(element => { console.log(element)});
    
  }
 findState(){
   
 }
  emitChange(change){
    this.emmitter.next(change);
   // this.event$.onNext(change);
  }
  recieveChange(){
    return this.event$.map(change=>{
      Object.assign(this.wizzardState, change);
      return this.wizzardState;
    })
  }

}
