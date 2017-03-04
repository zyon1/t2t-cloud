import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFire } from 'angularfire2';
// import { User } from '../common/user';
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
    constructor(public af: AngularFire) {
        this.users$=this.af.database.list('users'); 
        this.userData$=this.af.database.list('usersData'); 
        this.actionLog$=this.af.database.list('actionLog');
        this.usersObj$=this.af.database.object('users');
        this.userDataObj$=this.af.database.object('userData');
        this.groups$=this.af.database.list('groups');
        this.groupObj$=this.af.database.object('groups');
        this.groupMembers$=this.af.database.list('groupMembers');
        /*
        to push custom key to database af.database needs to be object, and object should be updated not pushed
        if you want to push with automatic key from firebase you can use databaseref as object or list
         */
    }
    createGroup(name, type){
        let tempObj={groupName: name, groupType: type};
                return this.groups$.push(tempObj);
                 //this.users$.push(data).then(console.log).catch(console.log);

    }
    joinUser(gid, uid){
          this.af.database.object('/groupMembers/' + gid).update({[uid]:{role:'member'}}).then(_ => console.log('update!'));
    }
    getMyRoles(gid,uid){
        return this.af.database.object('/groupMembers/'+gid+'/'+uid);
    }
    getMyGroups(){}
    getRolesNew(gid){
        return this.af.auth.flatMap( user => {
            return this.af.database.object('/groupMembers/'+gid+'/'+user.uid);
        });
    }
    getRoles(gid){
       let tempObj={};
        return Observable.create(observer => {
            this.af.auth.subscribe(user=>{
               this.af.database.object('/groupMembers/'+gid+'/'+user.uid).map(roles=>{
                   //console.log('roles service', roles);
                   observer.next(roles);
                   observer.complete();
               }); 
            });
        });
    }
    getMemberData(gid, uid){
        return this.af.database.object('/groupMembers/'+gid+'/'+uid);
    }
     getAllGroupData(){
        return this.groups$;
    }
     getAllGroups(){
        return this.groupObj$;
    }
    searchAllGroups(text){
        
        return this.af.database.list('groups', {
  query: {
    orderByChild: 'groupName',
    startAt: text,
    endAt: text
    
        }});
    }
    getGroupData(gid){
        return this.af.database.object('/groups/'+gid);
    }
    getGroupsOld(uid){
        return Observable.create( observer => {
            let tempGroups:any=[];
            this.af.database.list('/groupMembers/').map(snapshots => {
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
            this.af.database.list('/groupMembers/').subscribe(snapshots => {
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
        return this.af.database.list('/groupMembers/').map(groups => {
            groups.forEach(group => {
                group.forEach(element => {
                    console.log();
                });
            });
        });
    }
    getMyGroupsMembers(){
        return this.af.auth.flatMap(auth =>{
            return this.af.database.list('/groupMembers/').map(groups => {
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
        return this.af.database.list('/groupMembers/').flatMap(groups => {
                       let tmpGroups=[];
            groups.forEach(group => {
              if(group[uid]){
                  
                  
                  //console.log(group);

                                  tmpGroups.push(group) 


                  return this.af.database.object('/groups/'+group.$key);
                
            
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
                   return this.af.database.list('/groupMembers/').map(groups => {
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
        return this.af.auth.flatMap(auth=>{
           return this.af.database.list('/groupMembers/').map(groups => {
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
        let group$=Observable.from(this.af.database.list('/groupMembers/'));
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
            this.af.database.list('/groupMembers/' + gid+'/').subscribe(val => {
                observer.next(val);
            });
        });
*/
    }

    
}
