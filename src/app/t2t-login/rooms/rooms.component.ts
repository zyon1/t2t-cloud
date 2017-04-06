import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UnitsService } from '../units.service';
import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
uid:any;
gid:any;
oid:any;
rid:any;
unid:any;
myRooms:any;
myUrl:string;
ready:boolean=true;
  constructor(private route: ActivatedRoute, private router: Router,  private us: UnitsService) { 
    this.myUrl=this.router.url;

  }


  ngOnInit() {
this.route.params.subscribe(params =>{
   this.unid=params['unid'];
 //  console.log(this.unid);
   this.us.getUnitRooms(this.unid).subscribe(
         rooms => {
            rooms.forEach(element => {
                     this.us.getUnit(element['$key']).subscribe(data=>{
                   data.created=new Date(data.created);
                   element.data=data;
                  });         
            });
            this.myRooms=rooms;
        }

       );
});
this.route.parent.parent.parent.parent.params.subscribe(params =>{
   this.uid=params['id'];
       this.gid=params['gid'];
       this.oid=params['oid'];
  // console.log(this.uid);
  // console.log(this.gid);
  //  console.log(this.oid);

});


    
  }
  createRoom(){
    
    let data={
      active: false,
      createdBy: this.uid,
      created: firebase.database['ServerValue']['TIMESTAMP'],
      ready: false
    };
//console.log(this.unid, data);
   this.us.createRoom(this.unid, data);
      
   /* created: number,
            active: boolean,
            createdBy: string,//uid
            ready: boolean // ako nije minimalan broj podataka popunjen onda je false       
            */
  }

}

