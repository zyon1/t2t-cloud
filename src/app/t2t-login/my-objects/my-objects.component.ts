import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../login.service';
import { UnitsService } from '../units.service';
import { UnitsWizzardService } from '../units-wizzard.service';
import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-my-objects',
  templateUrl: './my-objects.component.html',
  styleUrls: ['./my-objects.component.css']
})
export class MyObjectsComponent implements OnInit {
uid:any;
myObjects:any;
myUrl:string;
ready:boolean=true;
  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService, private us: UnitsService, private uws: UnitsWizzardService) { 
    this.myUrl=this.router.url;
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
       //console.log(params['id']);
       this.uid=params['id'];
       console.log(params);
       //this.gid=params['gid'];
       this.us.getMyTObjects(this.uid).subscribe(
         objects => {
            objects.forEach(element => {
                     this.us.getTObject(element['$key']).subscribe(data=>{
                   data.created=new Date(data.created);
                   element.data=data;
                   element.units=this.us.getObjectUnits(element['$key']);
                  });         
            });
            this.myObjects=objects;
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
     this.us.updateMyObject(this.uid, x.key).then(
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
emitOid(oid){
  this.uws.setOid(oid);
}
}
