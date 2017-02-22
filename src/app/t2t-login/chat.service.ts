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
    setRecieved(uid, key){
        this.af.database.object('/userMessages/'+uid+'/'+key+'/').update({recieved:true});
    }
    setSeen(uid, key){
        this.af.database.object('/userMessages/'+uid+'/'+key+'/').update({seen:true});
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
    sendPrivateMessage(uid:string, message:Message){
        this.af.database.list('userMessages/'+uid+'/').push(message);
        
    }
    
}
