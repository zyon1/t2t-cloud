import { Component, OnInit } from '@angular/core';
import { UnitsWizzardService } from '../units-wizzard.service';
import {LoginService} from '../login.service';
import { GroupService} from '../group.service';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute}from '@angular/router';
@Component({
  selector: 'app-units-wizard',
  templateUrl: './units-wizard.component.html',
  styleUrls: ['./units-wizard.component.css']
})
export class UnitsWizardComponent implements OnInit {
  oid:string=null;
  uid:string=null;
  gid:string=null;
  unid:string=null;
  oid$:any;
  unid$:any;
  gid$:any;

  urlArray:any[];
  objUrl:string="";
  objUrlSource=new Subject();
  objUrl$=this.objUrlSource.asObservable();
  unitUrl:string;
  roomUrl:string;
  priceUrl:string;
  objectState:any;
  constructor( private uws:UnitsWizzardService, private Router: Router, private ActivatedRoute: ActivatedRoute) { 
      this.uws.unid$.subscribe(unid => {
  
      });
      this.uws.gid$.subscribe(gid => this.gid=gid);
      this.uws.oid$.subscribe(oid => this.oid=oid);
      this.uws.unid$.subscribe(unid => this.unid=unid);
      this.uid=this.uws.uid;
      /*
      console.log(this.uid, this.gid, this.oid, this.unid);
      this.gid$=this.uws.gid$;
      this.oid$=this.uws.oid$;
      this.unid$=this.uws.unid$;
      this.uid=this.uws.uid;*/
      
  /*
  let unitUrl$=this.gs.gid$.map(gid => {
    let tmpGid, tmpUnid, tempOid;
    let tmpUrl;
    tmpGid=gid;
    tmpUrl='/auth/user/'+this.uid+'/group/'+gid+'/units/object';
    this.uws.oid$.map(oid => {
      tempOid=oid;
      return   this.uws.unid$.map(unid => {
        tmpUnid=unid;
    return   
    });
    });
  }); 
  
  */
 
  //this.objUrl='/auth/user/'+this.uid+'/group/'+gid+'/units/object/'+oid;
  }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params =>{
      console.log('UWC Params', params);
      params.gid?this.uws.setGid(params.gid):null;
      params.oid?this.uws.setOid(params.oid):null;

            this.uws.getObjectState(this.oid).subscribe(x=> { 
        console.log('tObject state:',x);
        this.objectState=x;
    });
        });
          //console.log(this.route);
//console.log(this.route.url);
    

    //console.log(this.router);
    
  }
  onRecieveUnid(unid){
    console.log(unid);
    this.unid=unid;
  }

}
