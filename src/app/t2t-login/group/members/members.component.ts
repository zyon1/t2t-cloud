import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { GroupService } from '../../group.service';
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  @Input('gid') gid:string;
  @Input('roles') roles:string;
  members:any=[];
  constructor(private dataService: DataService, private groupService: GroupService) {
    
  }
  
  ngOnInit() {
     this.groupService.getGroupMembers(this.gid).subscribe(snapshot=>{
       this.members=snapshot;
       // console.log('snapshots', snapshot);
       /*snapshots.forEach(snapshot => {
         console.log(snapshot);
         this.dataService.getUserData(snapshot.key).subscribe(res=>{
           
            this.members.push(Object.assign({email:res.email}, snapshot));
         });
             
           });*/
           
           this.members.forEach(element => {
              this.dataService.getUserData(element.$key).subscribe(res=>{
               element.email=res.email;
         });
           });
           // console.log(this.members);
      
    });
  }
  updateRoles(uid, role){
        this.dataService.updateMember(this.gid, {[uid]:{role:role}}).then(e=> console.log('Updated roles!')).catch(e => console.error("T2t-error:", e));
  }

}
