import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';// import { User } from '../common/user';
// import { Credentials } from '../common/credentials';
@Injectable()
export class GroupService {
   users$:any;
   actionLog$:any;
   usersObj$:any;
   userDataObj$:any;
   userData$:any;
   groups$:any;
   groupObj$:any;
   groupMembers$:any;
    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
        this.users$=this.db.list('users'); 
        this.userData$=this.db.list('usersData'); 
        this.actionLog$=this.db.list('actionLog');
        this.usersObj$=this.db.object('users');
        this.userDataObj$=this.db.object('userData');
        this.groups$=this.db.list('groups');
        this.groupObj$=this.db.object('groups');
        this.groupMembers$=this.db.list('groupMembers');
        /*
        to push custom key to database db needs to be object, and object should be updated not pushed
        if you want to push with automatic key from firebase you can use databaseref as object or list
         */
    }
    createGroup(name, type){
        let tempObj={groupName: name, groupType: type};
                return this.groups$.push(tempObj);
                 //this.users$.push(data).then(console.log).catch(console.log);

    }
    joinUser(gid, uid){
          this.db.object('/groupMembers/' + gid).update({[uid]:{role:'member'}}).then(_ => console.log('update!'));
    }
    getMyRoles(gid,uid){
        return this.db.object('/groupMembers/'+gid+'/'+uid);
    }
    getMyGroups(){}
    getRolesNew(gid){
        return this.afAuth.authState.flatMap( user => {
            return this.db.object('/groupMembers/'+gid+'/'+user.uid);
        });
    }
    getRoles(gid){
       let tempObj={};
        return Observable.create(observer => {
            this.afAuth.authState.subscribe(user=>{
               this.db.object('/groupMembers/'+gid+'/'+user.uid).map(roles=>{
                   //console.log('roles service', roles);
                   observer.next(roles);
                   observer.complete();
               }); 
            });
        });
    }
    getMemberData(gid, uid){
        return this.db.object('/groupMembers/'+gid+'/'+uid);
    }
     getAllGroupData(){
        return this.groups$;
    }
     getAllGroups(){
        return this.groupObj$;
    }
    searchAllGroups(text){
        
        return this.db.list('groups', {
  query: {
    orderByChild: 'groupName',
    startAt: text,
    endAt: text
    
        }});
    }
    getGroupData(gid){
        return this.db.object('/groups/'+gid);
    }
    getGroupsOld(uid){
        return Observable.create( observer => {
            let tempGroups:any=[];
            this.db.list('/groupMembers/').map(snapshots => {
                snapshots.forEach(snapshot => {
                    // console.log(snapshot);
                    // console.log(snapshot[uid]);
                    if(snapshot[uid]){tempGroups.push(snapshot.$key);}

                });
                observer.next(tempGroups);
                // console.log(tempGroups)
                observer.complete();
            });

        });
    }
    
    getGroupsWithData(uid){
      

        return Observable.create( observer => {
            this.db.list('/groupMembers/').subscribe(snapshots => {
               let tempGroups:any=[];
                snapshots.forEach(snapshot => {
                   
                     // console.log(snapshots.length);
                    // console.log(snapshot[uid]);
                    
                    if(snapshot[uid]){
                        this.getGroupData(snapshot.$key).subscribe(groupData=>{
                             let tmpGroup:any={};
                            tmpGroup.$key=snapshot.$key;
                            tmpGroup.groupName=groupData.groupName;
                            tmpGroup.groupType=groupData.groupType;
                            tempGroups.push(tmpGroup);
                            observer.next(tempGroups);
                            //console.log(tempGroups, tempGroups.length);
                        });
                        
                    }
                // console.log(tempGroups)
                });
                //console.log(tempGroups, tempGroups.length);
               
            });

        });
    } 
    getGroupsNew(uid){
        return this.db.list('/groupMembers/').map(groups => {
            groups.forEach(group => {
                group.forEach(element => {
                    console.log();
                });
            });
        });
    }
    getMyGroupsMembers(){
        return this.afAuth.authState.flatMap(auth =>{
            return this.db.list('/groupMembers/').map(groups => {
                       let tmpGroups=[];
            groups.forEach(group => {
              if(group[auth.uid]){
                  //console.log(group);
                  tmpGroups.push( group) }/* 
                group.forEach(element => {
                    console.log(element);
                return element;
                });*/
            });
            return tmpGroups;
        });
        })
    }
    getMyGroupsWithData(uid){
        return this.db.list('/groupMembers/').flatMap(groups => {
                       let tmpGroups=[];
            groups.forEach(group => {
              if(group[uid]){
                  
                  
                  //console.log(group);

                                  tmpGroups.push(group) 


                  return this.db.object('/groups/'+group.$key);
                
            
        }/* 
                group.forEach(element => {
                    console.log(element);
                return element;
                });*/
            });
            //console.log(tmpGroups);
            return tmpGroups;
        });
    }
    getMyGroupsWithUid(uid){
                   return this.db.list('/groupMembers/').map(groups => {
                       let tmpGroups=[];
            groups.forEach(group => {
              if(group[uid]){console.log(group);
                  tmpGroups.push( group) }/* 
                group.forEach(element => {
                    console.log(element);
                return element;
                });*/
            });
            return tmpGroups;
        });
    }
    getMyGroups2(){
        return this.afAuth.authState.flatMap(auth=>{
           return this.db.list('/groupMembers/').map(groups => {
            groups.forEach(group => {
              if(group[auth.uid]){
                  //console.log(group); 
                }
              /* 
                group.forEach(element => {
                    console.log(element);
                return element;
                });*/
            });
        });
        })
    }
    getGroups(uid){
        let group$=Observable.from(this.db.list('/groupMembers/'));
        let search=( gid) => {  
            let temp=[];
            gid.forEach(gid => {
                   
                    // console.log(snapshot[uid]);
                    
                    if(gid[uid]){ 
                        
                        let tmpGroup:any={};
                            tmpGroup.$key=gid.$key;
                        
                        
                        
                         //console.log(gid.$key);
                    temp.push(gid.$key);

                    }
        });
        //console.log(temp);
        return temp;
            };

        let results=group$.map(x=>search(x));
    return results;
 
    }
    getGroupMembers(gid){
        return this.groupMembers$;
       /* return Observable.create( observer => {
            this.db.list('/groupMembers/' + gid+'/').subscribe(val => {
                observer.next(val);
            });
        });
*/
    }

    
}
