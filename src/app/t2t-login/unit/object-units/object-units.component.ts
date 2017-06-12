import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService} from '../../group.service';
import { UnitsService } from '../../units.service';
import { LoginService } from '../../login.service';
import { UnitsWizzardService } from '../../units-wizzard.service';

import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-object-units',
  templateUrl: './object-units.component.html',
  styleUrls: ['./object-units.component.css']
})
export class ObjectUnitsComponent implements OnInit {
unid:any;
uid:any;
gid:any;
oid:any;
myUnits:any;
myUrl:string;
ready:boolean=true;
  constructor(private route: ActivatedRoute, private router: Router,  private us: UnitsService, private uws:UnitsWizzardService, private gs:GroupService, private ls:LoginService) { 
    //this.myUrl=this.router.url;
    this.oid=this.uws.oid;
    this.unid=this.uws.unid;
    this.uid=this.uws.uid;
    this.gid=this.uws.gid;
    this.myUrl='/auth/user/'+this.uid+'/group/'+this.gid+'/units/object/'+this.oid+'/units';
  }
  ngOnInit() {
    this.us.getObjectUnits(this.oid).subscribe(
         units => {
           if (units.length==0){
            // console.log(units.length==0);
             this.uws.setObjectState(this.oid, 'notJedinice', 'notJedinice');
           }
            units.forEach(element => {
                     this.us.getUnit(element['$key']).flatMap(data=>{
                   data.created=new Date(data.created);
                   element.data=data;
                   return this.us.getUnitBasic(data['$key']).map(uData =>{
                     //console.log(uData);
                     element.data.name=uData.name;
                   });
                   
                  }).subscribe();         
            });
            this.myUnits=units;
        });

  }
  createUnit(){
    let data={
      active: false,
      createdBy: this.uid,
      created: firebase.database['ServerValue']['TIMESTAMP'],
      ready: false
    };
    
   this.us.createUnit(this.oid, data).then(unid => {
     this.router.navigate(['auth/user/'+this.uid+'/group/'+this.gid+'/units/object/'+this.oid+'/units/'+unid])
   });
      
   /* created: number,
            active: boolean,
            createdBy: string,//uid
            ready: boolean // ako nije minimalan broj podataka popunjen onda je false       
            */
  }
emitUnid(unid){
  this.uws.setUnid(unid);
}

}
