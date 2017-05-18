import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
//import { FirebaseAuth } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Router, ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import {LoginService } from './login.service';
@Injectable()
export class UnitsWizzardService {
oid:string;
gid:string;
uid:string;
unid:string;
private oidSource = new Subject<string>();
private unidSource = new Subject<string>();
private gidSource = new Subject<string>();
  // Observable string streams
  oid$ = this.oidSource.asObservable();
  unid$ = this.unidSource.asObservable();
  gid$=this.gidSource.asObservable();
  constructor(private db: AngularFireDatabase, private ls:LoginService) {
   // this.wizzardState.foreach(element => { console.log(element)});
   this.uid=this.ls.uid;
    this.oid$.subscribe(oid=>{
      this.oid=oid;
      console.log('received oid');
    });
    this.gid$.subscribe(gid=>{
      this.gid=gid;
      console.log('received gid');
    });
    this.unid$.subscribe(unid=>{
      this.unid=unid;
      console.log('received unid', unid);
    });
  }
  setOid(oid){
    this.oidSource.next(oid);
  }
  setUnid(unid){
    this.unidSource.next(unid);
  }
    setGid(gid){
    this.gidSource.next(gid);
  }
 getObjectState(oid){
   return this.db.object('objectState/'+oid+'/object');
 }
  setObjectState(oid, data){
    this.db.object('objectState/'+oid+'/object').update(data);
  }
}
