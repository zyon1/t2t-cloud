import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Watcher } from './watcher';
import * as firebase from 'firebase';

@Injectable()
export class WatchingService {
    
    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
          
    }
    /*
     type:number;
    created:any;
    active:boolean;
    delivered:boolean;
    error?:string;
    solved: boolean
    gid?: string;
     */
    setWatcher(uid, data){
        let watch: Watcher= new Watcher();
        watch.created=firebase.database['ServerValue']['TIMESTAMP'];
        Object.assign( watch, data);
        console.log(watch);
        return this.db.list('watcher/'+uid+'/').push(watch);
    }
    setUnitWatcher(unid, data){
        let watch: Watcher= new Watcher();
        watch.created=firebase.database['ServerValue']['TIMESTAMP'];
                Object.assign( watch, data);
        console.log(watch);
        return this.db.list('unitWatcher/'+unid+'/').push(watch);
   }
    updateWatcher(uid, key, data){
        return this.db.object('watcher/'+uid+'/'+key+'/').update(data);

    }
    archive(uid, key){
        // obavi zamišljeno ali baci error
         this.db.object('watcher/'+uid+'/'+key+'/').subscribe(val=>{
             console.log(val);
             let tempWatcher={[val.$key]:{created:val.created, data:val.data, solved: val.solved, active:val.active, delivered:val.delivered}};
             console.log(tempWatcher);
             this.db.object('watcherArcive/'+uid+'/').update(tempWatcher).then(
                 x =>
                 this.db.object('watcher/'+uid+'/'+key+'/').remove().then(console.log).catch(console.error)
                 );
         });
         //this.db.object('watcherArchive/'+uid+'/'+key+'/').subscribe();
    }
    getWatchersNew(uid){
        return this.db.list('watcher/'+uid+'/').map(val => {
             val.forEach(element => {
                  this.db.object('watcher/'+uid+'/'+element.$key+'/').update({delivered:true});
             });
        });
    }
    resolveMyUnitWatchers(unis){
        /**
         * forEachOfMyGroups fetch objects, for each object fetch units, check if there is new unitWatcher for that unit
         * forEachOfMyobjects, for each object fetch units, check if there is new unitWatcher for that unit
         */
    }
    getWatchers(uid){
         return Observable.create( observer => {
             let tempKey:any;
            this.db.list('watcher/'+uid+'/').subscribe(val => {
                observer.next(val);
                val.forEach(element => {
                  this.db.object('watcher/'+uid+'/'+element.$key+'/').update({delivered:true});
                });
                
            });
            
        });
    }
}
