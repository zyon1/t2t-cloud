import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Message, GroupMessage } from './message';
import * as firebase from 'firebase';

@Injectable()
export class ChatService {
    noMsgGroup:number=10;
    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    }
    getGroupChat(gid: string, loadMore?:number){
        let tempMsgs:any=[];
        let tempNoMsg=loadMore?loadMore:10;
        return this.db.list('/groupMessages/'+gid+'/' ,{
  query: {
     limitToLast: tempNoMsg,
            }});
        /*return Observable.create(observer => {
            this.db.list('/groupMessages/'+gid+'/' ,{
  query: {
     limitToLast: tempNoMsg,
            }}).subscribe(snapshots => {
                tempMsgs=snapshots;
                //console.log(tempMsgs);
                observer.next(tempMsgs);
            });
        });*/
    }
    setRecieved(uid, rUid, key){
        this.db.object('/userMessages/'+uid+'/'+rUid+'/'+key+'/').update({recieved:true});
    }
    setSeen(uid, key){
        this.db.object('/userMessages/'+uid+'/'+key+'/').update({seen:true});
    }
    /*setRecipents(myuid, recipentUid)
    {   
        this.db.list('/myChats/'+myuid).subscribe()
        this.db.object('/myChats/'+myuid).update({seen:true});
    }
    getRecipents(myuid)
    {
         return this.db.list('/myChats/'+myuid);
    }*/
    getUserChatMsgs(uid, loadMore?)
    {
                let tempMsgs:any=[];
        let tempNoMsg=loadMore?loadMore:10;
        return this.afAuth.authState.flatMap(auth =>{
            return this.db.list('/userMessages/'+auth.uid+'/'+uid ,{
  query: {
     limitToLast: tempNoMsg,
            }});
        })
    }
    getUserChatNew(){
        return this.afAuth.authState.flatMap(auth =>{
            return this.db.list('/userMessages/'+auth.uid+'/');
        })
    }
    getUserChat(uid: string, loadMore?:number){
        let tempMsgs:any=[];
        let tempNoMsg=loadMore?loadMore:10;
        return this.db.list('/userMessages/'+uid+'/' ,{
  query: {
     limitToLast: tempNoMsg,
            }});
        //
        /*return Observable.create(observer => {
            .subscribe(snapshots => {
                tempMsgs=snapshots;
                //console.log(tempMsgs);
                observer.next(tempMsgs);
            });
        });*/
    }
    sendGroupMessage(gid:string, message:GroupMessage){
        return this.db.list('groupMessages/'+gid+'/').push(message);
    }
    getPrivateChat(uid:string){
    }
    sendPrivateMessage(uid:string, recipentUid, message:Message){
        this.db.list('userMessages/'+uid+'/' + recipentUid).push(message);
        
    }
    lastChats(uid){
        this.afAuth.authState.subscribe(user => this.db.list('lastChats/'+user.uid).push(uid) );
        //this.db.list('lastChats').push(uid);
    }
    setLastChats(uid){
        let tmpUid;
            let isInChats=false;
            let keyToRemove;
this.afAuth.authState.flatMap(user =>{
            tmpUid=user.uid;
            return this.db.list('lastChats/'+user.uid);
        }).first().subscribe(chats =>{
           // console.log(chats);
     chats.forEach(chat=>{
             //     console.log(chat.$value==uid, chat.$value, uid);

         if(chat.$value==uid){
               //       console.log("isInChats", chat.$key);
             isInChats=true;
             keyToRemove=chat.$key;
         }
        
     });
if(isInChats){
                  this.db.list('lastChats/'+tmpUid).remove(keyToRemove).then( x => this.db.list('lastChats/'+tmpUid).push(uid)).catch()

 }else{this.db.list('lastChats/'+tmpUid).push(uid);}
                    
 } );


 
                     
    }
    getLastChats(){
        return this.afAuth.authState.flatMap(user =>{
            return this.db.list('lastChats/'+user.uid, {
  query: {
    limitToFirst: 20

  }
});
        });
        
    }
    restructureBase(){
        
        this.db.list('userMessages/').subscribe(
            users => {
                users.forEach(user => {
                    let userMessages:any=[];
                     this.db.list('userMessages/'+user.$key).subscribe(
                         messages => {
                             let subject;
                             messages
                         }
                     );
                });
            }

        );    
    }
    
}
