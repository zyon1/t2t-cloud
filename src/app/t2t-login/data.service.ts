import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { User } from '../common/user';
// import { Credentials } from '../common/credentials';
@Injectable()
export class DataService {
   users$:any;
   actionLog$:any;
   usersObj$:any;
   userDataObj$:any;
   userData$:any;
    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
        this.users$=db.list('users'); 
        this.userData$=db.list('userData'); 

        this.actionLog$=db.list('actionLog');
        this.usersObj$=db.object('users');
        this.userDataObj$=db.object('userData');
        /*
        to push custom key to database db needs to be object, and object should be updated not pushed
        if you want to push with automatic key from firebase you can use databaseref as object or list
         */
    }
    addAction(data){
        /* TODO: actions should be connected to userdata with uid - partially solved */
        // TODO: actionLog je nedovršen - logging added only for register action
        // data is defined:
        //     login-form.component.ts:45 - corrected
        //     register-form.component.ts:34 -  deprecated - need to check if used anywhere if not remove it from application
        // *methods and functions with New in name are for developing purpose, after function is tested New should be removed from name and old function should be replaced
        return this.actionLog$.push(data);
        
        /*return Observable.create(observer => {
            this.actionLog$.push(data).then(r=>{
                         observer.next(true);
                         observer.complete();
                        }
                     ).catch(e=>{
                             observer.next(false);
                             observer.complete();
                             console.error('T2T error:', e);
                         });
            });*/
        }
        //rewrite addUser after data restructuring
        // untested!
        // while creating new user one funtion is called, for updating user and userData separate calls should be made
        newAddUser(data){
            return  this.usersObj$.update(data);
/*
            return Observable.create(observer => {
                 this.usersObj$.update(data).then(
                     r => {
                         this.userDataObj$.update(userData)
                            .then(response => {
                                observer.next(true);
                                observer.complete();
                            })
                            .catch(err => {
                                observer.next(false);
                                observer.complete();
                                console.error('T2T error:', err);
                            });
                         
                        }
                     ).catch(e=>{
                             observer.next(false);
                             observer.complete();
                             console.error('T2T error:', e);
                         });
                 //this.users$.push(data).then(console.log).catch(console.log);
        });
*/
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
        return this.actionLog$;
        /*
        return Observable.create( observer => {
            this.actionLog$.subscribe(val => {
                observer.next(val);
                observer.complete();
            });
        });
        */
    }
  private getFBUser$(){
       return this.afAuth.authState;
   }
   // new function needs to be tested
   getUserNew(){
            return this.getFBUser$().flatMap(auth =>{
                return this.db.object('/users/' + auth.uid).map( user => {
                    let tempUser=user;
                    tempUser.displayName=auth.displayName;
                    tempUser.email=auth.email;
                    tempUser.uid=auth.uid;
                    return tempUser})
            }).catch((err)=>{
                console.log('Not logged in!');
                    //console.error(err);
                    return this.getFBUser$()});;
       
   }
   // if getUser and getUserData are called without parameter they return logged user data 
   getUser(uid?){
       return Observable.create(
           observer => {
               if (!uid){
               this.getFBUser$().subscribe(
                   auth=>{
                       this.db.object('/users/' + auth.uid).subscribe(
                           x => {
                                observer.next(x);
                                observer.complete();
                           }
                       );
                    });
               }else{
                   this.db.object('/users/' + uid).subscribe(
                           x => {
                                observer.next(x);
                                observer.complete();
                           }
                       );
               }
            });
    }
       // new function needs to be tested
       getLoggedUserData(){
           return this.getFBUser$().flatMap(auth =>{
                return this.db.object('/userData/' + auth.uid);
            });
       }
          getUserDataWithEmail(uid){
            return this.db.object('/userData/' + uid).flatMap(data => {
              
                 return this.db.object('/users/' + uid).map(
                     user => {
                        let tmpData:any=data;
                         tmpData.email=user.email;
                         //console.log(tmpData);
                         return tmpData;
                     }
                 );
  
            });

   }
   getUserDataNew(uid?){
        if (!uid){
            return this.getFBUser$().flatMap(auth =>{
                return this.db.object('/userData/' + auth.uid);
            });
        }else{
            return this.db.object('/userData/' + uid);
        }
   }
      getUserData(uid?){
       return Observable.create(
           observer => {
               if (!uid){
               this.getFBUser$().subscribe(
                   auth=>{
                       this.db.object('/userData/' + auth.uid).subscribe(
                           x => {
                                observer.next(x);
                                observer.complete();
                           }
                       );
                    });
               }else{
                   this.db.object('/userData/' + uid).subscribe(
                           x => {
                                observer.next(x);
                                observer.complete();
                           }
                       );
               }
            });
    }


    // get AllUsers havent changed
    getAllUsers(){
        return this.users$;/*
       return Observable.create( observer => {
            this.users$.subscribe(val => {
                observer.next(val);
                observer.complete();
            });
        });*/
    }
    getAllUserData(){
        return this.userData$;
        /*
        return Observable.create( observer => {
            this.userData$.subscribe(val => {
                observer.next(val);
                observer.complete();
            });
        });*/
    }
   //update user havent changed
    updateUser(data: any, uid?: string) {
        if (uid){
        this.db.object('/users/' + uid).update(data).then(_ => console.log('update!'));
        }
        else{
            this.usersObj$.update(data).then(_ => console.log('update!'));
        }
  }
  updateMember(group:string, data: any) {
        return this.db.object('/groupMembers/' + group).update(data);
  }
  updateUserData(data: any, uid?: string) {
    if (uid){
        this.db.object('/userData/' + uid).update(data).then(_ => console.log('update!'));
        }
        else{
            this.userDataObj$.update(data).then(_ => console.log('update!'));
        }
  }
    
}