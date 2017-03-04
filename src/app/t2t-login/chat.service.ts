import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFire } from 'angularfire2';
import { Message, GroupMessage } from './message';
import * as firebase from 'firebase';

@Injectable()
export class ChatService {
    noMsgGroup:number=10;
    constructor(private af: AngularFire) {
    }
    getGroupChat(gid: string, loadMore?:number){
        let tempMsgs:any=[];
        let tempNoMsg=loadMore?loadMore:10;
        return this.af.database.list('/groupMessages/'+gid+'/' ,{
  query: {
     limitToLast: tempNoMsg,
            }});
        /*return Observable.create(observer => {
            this.af.database.list('/groupMessages/'+gid+'/' ,{
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
        this.af.database.object('/userMessages/'+uid+'/'+rUid+'/'+key+'/').update({recieved:true});
    }
    setSeen(uid, key){
        this.af.database.object('/userMessages/'+uid+'/'+key+'/').update({seen:true});
    }
    /*setRecipents(myuid, recipentUid)
    {   
        this.af.database.list('/myChats/'+myuid).subscribe()
        this.af.database.object('/myChats/'+myuid).update({seen:true});
    }
    getRecipents(myuid)
    {
         return this.af.database.list('/myChats/'+myuid);
    }*/
    getUserChatMsgs(uid, loadMore?)
    {
                let tempMsgs:any=[];
        let tempNoMsg=loadMore?loadMore:10;
        return this.af.auth.flatMap(auth =>{
            return this.af.database.list('/userMessages/'+auth.uid+'/'+uid ,{
  query: {
     limitToLast: tempNoMsg,
            }});
        })
    }
    getUserChatNew(){
        return this.af.auth.flatMap(auth =>{
            return this.af.database.list('/userMessages/'+auth.uid+'/');
        })
    }
    getUserChat(uid: string, loadMore?:number){
        let tempMsgs:any=[];
        let tempNoMsg=loadMore?loadMore:10;
        return this.af.database.list('/userMessages/'+uid+'/' ,{
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
        return this.af.database.list('groupMessages/'+gid+'/').push(message);
    }
    getPrivateChat(uid:string){
    }
    sendPrivateMessage(uid:string, recipentUid, message:Message){
        this.af.database.list('userMessages/'+uid+'/' + recipentUid).push(message);
        
    }
    lastChats(uid){
        this.af.auth.subscribe(user => this.af.database.list('lastChats/'+user.uid).push(uid) );
        //this.af.database.list('lastChats').push(uid);
    }
    setLastChats(uid){
        let tmpUid;
            let isInChats=false;
            let keyToRemove;
this.af.auth.flatMap(user =>{
            tmpUid=user.uid;
            return this.af.database.list('lastChats/'+user.uid);
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
                  this.af.database.list('lastChats/'+tmpUid).remove(keyToRemove).then( x => this.af.database.list('lastChats/'+tmpUid).push(uid)).catch()

 }else{this.af.database.list('lastChats/'+tmpUid).push(uid);}
                    
 } );


 
                     
    }
    getLastChats(){
        return this.af.auth.flatMap(user =>{
            return this.af.database.list('lastChats/'+user.uid, {
  query: {
    limitToFirst: 20

  }
});
        });
        
    }
    restructureBase(){
        
        this.af.database.list('userMessages/').subscribe(
            users => {
                users.forEach(user => {
                    let userMessages:any=[];
                     this.af.database.list('userMessages/'+user.$key).subscribe(
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
