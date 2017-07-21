import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../../group.service';
import { LoginService } from '../../login.service';
import { UnitsService } from '../../units.service';
import { UnitsWizzardService } from '../../units-wizzard.service';

import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class UnitsComponent implements OnInit {
uid:any;
gid:any;
myObjects:any;
myObjects$:any;

myUrl:string;
ready:boolean=true;
  constructor(private route: ActivatedRoute, private router: Router, private groupService: GroupService, private loginService: LoginService, private us: UnitsService, private uws: UnitsWizzardService) { 
    this.myUrl=this.router.url;
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
       //console.log(params['id']);
       this.uid=params['id'];
       console.log(params);
       this.gid=params['gid'];
       this.myObjects$=this.us.getGroupObjects(this.gid).map(
         objects => {
           console.log('objects changed');
            objects.forEach(element => {
                     this.us.getTObject(element['$key']).subscribe(data=>{
                   data.created=new Date(data.created);
                   element.data=data;
                   let tmpArr=[];
                   element.units=this.us.getObjectUnits(element['$key']).map(units => {
                     let tmpArr=[];
                     units.forEach(unit => {
                        console.log(unit);

                       tmpArr.push(
                         {
                           unid:unit['$key'], 
                           ready$:this.us.getUnit(unit['$key']).map(unit => {return unit.ready}), 
                           name$: this.us.getUnitBasic(unit['$key']).map(unit => {return unit.name})});
                     });
                     return tmpArr;
                   })

                   
                   
                   //console.log(element.units);
                  });         
            });
            //this.myObjects=objects;
            return objects;
        }

       );
    });
  }
  createObject(){
    let data={
      active: false,
      createdBy: this.uid,
      created: firebase.database['ServerValue']['TIMESTAMP'],
      ready: false
    };
    
   this.us.addTObject(data).then(x=>{
     this.us.updateGroupObject(this.gid, x.key).then(
       update=>{
         this.router.navigate([this.myUrl+'/object/'+x.key])
       }
     );
     
     }
   );
      
   /* created: number,
            active: boolean,
            createdBy: string,//uid
            ready: boolean // ako nije minimalan broj podataka popunjen onda je false       
            */
  }
  getUnitName(unid){
    this.us.getUnit(unid).subscribe(unit => 
    {
      if (unit.ready)
      console.log(unit.name);
    return unit.name;
  }
    );
  }
  changeState(oid, state){

      this.us.getTObject(oid).update({active:state});

  }
emitOid(oid){
  this.uws.setOid(oid);
}
}
