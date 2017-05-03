import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UnitsService } from '../../units.service';
import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-object-units',
  templateUrl: './object-units.component.html',
  styleUrls: ['./object-units.component.css']
})
export class ObjectUnitsComponent implements OnInit {
uid:any;
gid:any;
oid:any;
myUnits:any;
myUrl:string;
ready:boolean=true;
  constructor(private route: ActivatedRoute, private router: Router,  private us: UnitsService) { 
    this.myUrl=this.router.url;

  }

  ngOnInit() {
 
    this.route.parent.parent.params.subscribe( params => {
       //console.log(params['id']);
       this.uid=params['id'];
       this.gid=params['gid'];
       this.oid=params['oid'];
       console.log(this.oid, this.uid, this.gid);

       this.us.getObjectUnits(this.oid).subscribe(
         units => {
            units.forEach(element => {
                     this.us.getUnit(element['$key']).subscribe(data=>{
                   data.created=new Date(data.created);
                   element.data=data;
                  });         
            });
            this.myUnits=units;
        }

       );
    });
  }
  createUnit(){
    let data={
      active: false,
      createdBy: this.uid,
      created: firebase.database['ServerValue']['TIMESTAMP'],
      ready: false
    };
    
   this.us.createUnit(this.oid, data);
      
   /* created: number,
            active: boolean,
            createdBy: string,//uid
            ready: boolean // ako nije minimalan broj podataka popunjen onda je false       
            */
  }

}