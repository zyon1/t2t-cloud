import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from '../../group.service';
import { LoginService } from '../../login.service';
import { DataService } from '../../data.service';
import { WatchingService } from '../../watching.service';
import { Router, ActivatedRoute, Params} from '@angular/router';



@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
private users:any;
private results: any=[];
gid:any;
gName:any;
  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService, private loginService:LoginService, private groupService:GroupService, private ws: WatchingService ) { 
    this.dataService.getAllUserData().subscribe(users=>{this.users=users;console.log(this.users);});
    
  }

  ngOnInit() {
this.route.params.subscribe( params => {
this.gid=params['gid'];
this.groupService.getGroupData(this.gid).subscribe(group=>{
    console.log(group);
  this.gName=group.groupName;
});
});
  }
  search(email){
    this.results=[];
    let i=0;
    if (email!="" && i<11){  
      this.users.forEach(element => {
        if (element.email.search(email) > -1){
          this.results.push({email:element.email, uid:element.$key});
        }
        i++;
     });
    }
    console.log("search:",email);
  }
  /*
      event:string;
    created:any;
    active:boolean;
    delivered:boolean;
    error:string;
    solved: boolean
   */
  invite(uid){
    
    let tempData={type:1, active:true, delivered:false, solved:false, data:{gid:this.gid, gName:this.gName}};
    this.ws.setWatcher(uid, tempData);
    console.log(uid);
  }

}
