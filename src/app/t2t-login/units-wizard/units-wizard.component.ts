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
  objectCompleted:boolean=false;
  unitCompleted:boolean=false;
  pricesCompleted:boolean=false;
  urlArray:any[];
  objUrl:string="";
  objUrlSource=new Subject();
  objUrl$=this.objUrlSource.asObservable();
  unitUrl:string;
  roomUrl:string;
  priceUrl:string;
  objectState:any;
  unitState:any;
  objectActive:boolean=false;
  unitActive:boolean=false;
  pricesActive:boolean=false;
  constructor( private uws:UnitsWizzardService, private Router: Router, private ActivatedRoute: ActivatedRoute) { 
      this.uws.unid$.subscribe(unid => {
  
      });
      this.uws.gid$.subscribe(gid => this.gid=gid);
      this.uws.oid$.subscribe(oid => this.oid=oid);
      this.uws.unid$.subscribe(unid => {this.unid=unid
       this.uws.getUnitState(unid).subscribe(x=> {
         if(x.object && x.object.osnovno && x.object.oprema && x.object.kb && x.object.sobe && x.object.slike && x.object.osnovno.completed && x.object.oprema.completed && x.object.kb.completed && x.object.sobe.completed && x.object.slike.completed ){
           console.log('unit is complete');
           this.unitCompleted=true;
         } else{
           this.unitCompleted=false;
         }
         if (x.object && x.object.prices && x.object.prices.completed){
           this.pricesCompleted=true;
           if (!x.object.ready){
           this.uws.setUnitState(this.oid, 'ready', 'ready')
           this.uws.activateObject(this.oid).then( r=> {
             this.uws.activateUnit(this.unid);
            });
            }
         }else{
           this.pricesCompleted=false;
         }
       this.unitState=x.object;

      });  
    });
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
    
    this.Router.events.subscribe(route=>{
      let urlArray=route['url'].toString().split('/');
      console.log(urlArray);
      
if (urlArray.length ==9 || urlArray.length == 10 && urlArray[9]!='units'){
this.objectActive=true;
console.log("Object Active");
    }
    else{
      this.objectActive=false;
console.log("Object inactive");
    }
    if (urlArray.length ==11 || urlArray.length==12 && urlArray[11]!='prices'){
this.unitActive=true;
this.pricesActive=false;
    }
    else{
      this.unitActive=false;
      this.pricesActive=true;
    }

    });
    

    this.ActivatedRoute.params.subscribe(params =>{
      console.log('UWC Params', params);
      params.gid?this.uws.setGid(params.gid):null;
      params.oid?this.uws.setOid(params.oid):null;

            this.uws.getObjectState(this.oid).subscribe(x=> { 
        console.log('tObject state:',x);
        this.objectState=x.object;
        
        if (x.object && x.object.osnovno && x.object.politika && x.object.sadrzaji && x.object.slike && x.object.osnovno.completed && x.object.politika.completed && x.object.sadrzaji.completed && x.object.slike.completed){
          this.objectCompleted=true;
          console.log('Object completed!');
        }else{
          this.objectCompleted=false;
          console.log('object isnt completed');
        }
      
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
