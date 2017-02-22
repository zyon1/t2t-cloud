import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../group.service';
import { LoginService } from '../login.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
uid:any;
groupMembers:any=[];
debugger:any;
groupName:any;
active:string='overview';

private role:any;
private gid:string;
  constructor(private route: ActivatedRoute, private router: Router, private groupService: GroupService, private loginService: LoginService) {
    //console.log("groups");
    
    
    
  }
  ngOnInit() {
    this.route.params.subscribe( params => {
       //console.log(params['id']);
       this.uid=params['uid'];
       this.gid=params['gid'];
       this.groupService.getGroupData(this.gid).subscribe(groupData => {
         //console.log('gid, gdata',this.gid, groupData);
          this.groupName=groupData.groupName;
            //console.log(r);
       });
       this.loginService.getLoggedUser().subscribe(user=>{});
       this.groupService.getMyRoles(this.gid, this.uid).subscribe(roles=>{});
        // snippet works - wrong place
       /*this.groupService.getGroupMembers(params['id']).subscribe(snapshots => {
           snapshots.forEach(snapshot => {
              this.groupMembers.push(Object.assign({uid:snapshot.key}, snapshot));
           });
       });*/
       
    });
  }
  overview(){
    this.active='overview';
  }
  actions(){
    this.active='actions';
  }
  members(){
    this.active='members';
  }
  content(){
    this.active='content';
  }
  units(){
    this.active='units';
  }
  invite(){
    this.active='invite';
  }
}
