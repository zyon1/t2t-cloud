import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AngularFire } from 'angularfire2';


import { User } from '../common/user';
// import { Credentials } from '../common/credentials';

  
@Injectable()
export class DataService {
   users$:any;
   actionLog$:any;
   usersObj$:any;
   
    constructor(public af: AngularFire) {
        this.users$=af.database.list('users');
        this.actionLog$=af.database.list('actionLog');
        this.usersObj$=af.database.object('users');
        /*
        to push custom key to database af.database needs to be object, and object should be updated not pushed
        if you want to push with automatic key from firebase you can use databaseref as object or list
         */
    }
    addAction(data){
        /* TODO: actions should be connected to userdata with uid */
        return Observable.create(observer => {
            this.actionLog$.push(data).then(r=>{
                         observer.next(true);
                         observer.complete();
                        }
                     ).catch(e=>{
                             observer.next(false);
                             observer.complete();
                             console.error('T2T error:', e);
                         });
        });
        }
        addUser(data){
             return Observable.create(observer => {
                 this.usersObj$.update(data).then(r=>{
                         observer.next(true);
                         observer.complete();
                        }
                     ).catch(e=>{
                             observer.next(false);
                             observer.complete();
                             console.error('T2T error:', e);
                         });
                 //this.users$.push(data).then(console.log).catch(console.log);
        });
        }
    getAllActions(){
        return Observable.create( observer => {
            this.actionLog$.subscribe(val => {
                observer.next(val);
                observer.complete();
            });
        });
    }
    getUser(uid){
        let tempUser:any;
        this.usersObj$.subscribe(user=>{tempUser=user.uid; console.log(tempUser);});
        
        return tempUser;
    }
    getAllUsers(){
        return this.users$.subscribe(val => console.log(val));
    }
    updateUser(data: any) {
    this.usersObj$.update(data).then(_ => console.log('update!'));
  }
    
}