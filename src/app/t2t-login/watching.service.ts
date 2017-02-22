import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFire } from 'angularfire2';
import { Watcher } from './watcher';
import * as firebase from 'firebase';

@Injectable()
export class WatchingService {
    
    constructor(public af: AngularFire) {
          
    }
    setWatcher(uid, data){
        let watch: Watcher= new Watcher();
        watch.created=firebase.database['ServerValue']['TIMESTAMP'];
        Object.assign( watch, data);
        return this.af.database.list('watcher/'+uid+'/').push(watch);
    }
    updateWatcher(uid, key, data){
        return this.af.database.object('watcher/'+uid+'/'+key+'/').update(data);

    }
    archive(uid, key){
        // obavi zamišljeno ali baci error
         this.af.database.object('watcher/'+uid+'/'+key+'/').subscribe(val=>{
             let tempWatcher={[val.$key]:{created:val.created, gName: val.gName, gid:val.gid, solved: val.solved, active:val.active, delivered:val.delivered}};
             console.log(tempWatcher);
             this.af.database.object('watcherArcive/'+uid+'/').update(tempWatcher).then(
                 x =>
                 this.af.database.object('watcher/'+uid+'/'+key+'/').remove().then(console.log).catch(console.error)
                 );
         });
         //this.af.database.object('watcherArchive/'+uid+'/'+key+'/').subscribe();
    }
    getWatchersNew(uid){
        return this.af.database.list('watcher/'+uid+'/').map(val => {
             val.forEach(element => {
                  this.af.database.object('watcher/'+uid+'/'+element.$key+'/').update({delivered:true});
             });
        });
    }
    getWatchers(uid){
         return Observable.create( observer => {
             let tempKey:any;
            this.af.database.list('watcher/'+uid+'/').subscribe(val => {
                observer.next(val);
                val.forEach(element => {
                  this.af.database.object('watcher/'+uid+'/'+element.$key+'/').update({delivered:true});
                });
                
            });
            
        });
    }
}
