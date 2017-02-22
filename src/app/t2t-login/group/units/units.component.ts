import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../../group.service';
import { LoginService } from '../../login.service';
import { UnitsService } from '../../units.service';
import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
uid:any;
gid:any;
myObjects:any;
myUrl:string;
ready:boolean=true;
  constructor(private route: ActivatedRoute, private router: Router, private groupService: GroupService, private loginService: LoginService, private us: UnitsService) { 
    this.myUrl=this.router.url;
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
       //console.log(params['id']);
       this.uid=params['id'];
       console.log(params);
       this.gid=params['gid'];
       this.us.getGroupObjects(this.gid).subscribe(
         objects => {
            objects.forEach(element => {
                     this.us.getTObject(element['$key']).subscribe(data=>{
                   data.created=new Date(data.created);
                   element.data=data
                  })         
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
     this.us.updateGroupObject(this.gid, x.key).then(
       update=>{
         this.router.navigate([this.myUrl+'/edit/'+x.key])
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

}
