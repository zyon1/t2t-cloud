import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../group.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {
uid:any;
groups:any;
loader:boolean=true;
reset=false;
  constructor(private route: ActivatedRoute, private router: Router, private gs: GroupService, private ls: LoginService) { 
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.gs.getGroups(params['id']).subscribe(groups=>{
               this.groups=[];

      this.uid=params['id'];
      console.log('GROUPS', groups);
        groups.forEach(group=>{
          this.gs.getGroupData(group).subscribe(groupData=>{
            this.groups.push(groupData);
           // console.log('gd',groupData);
          });
          
        });
        
        this.loader=false;

      }
      );
    });

  }

}
