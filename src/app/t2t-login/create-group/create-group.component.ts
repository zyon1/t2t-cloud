import { Component, OnInit, Input } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Router }    from '@angular/router';
import { IntraNavComponent} from '../intra-nav/intra-nav.component';
import * as firebase from 'firebase';
/* services */
import { LoginService } from '../login.service';
import { DataService } from '../data.service';
import { GroupService } from '../group.service';
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
  private uid:string;
  private primaryGroup: string = null;
  constructor( public loginService: LoginService, private router: Router, private dataService: DataService, private groupService: GroupService ) {
    this.dataService.getUser().subscribe(res=>{
      this.uid=res.$key;
      console.log(this.uid);
      this.primaryGroup=res.primaryGroup?res.primaryGroup:null;
      //this.primaryGroup=r
    });
    this.dataService.getUserData().subscribe(res=>console.log(res));
  }

  ngOnInit() {
  }
  createGroup(name, type){
    console.log('Create group..');
    this.groupService.createGroup(name, type).then(res=>{
      console.log('asd', res.key);
         if (res.key){
        if (this.primaryGroup == null ){
            this.dataService.updateUser({ primaryGroup:res.key }, this.uid);
            
        }else{
          let msg='Već je postavljena primarna grupa!';
          console.log(msg);
        }
        this.dataService.updateMember(res.key, {[this.uid]:{role:'admin'}});
      }
    
                        console.log("Group created");
}
                        
                     ).catch(e=>{

                             //observer.complete();
                             //console.error('T2T error:', e);
                         });
    

    //console.log(this.uid);
    //console.log(this.primaryGroup);
    // assing primaryGroup if user doesnt have it
    // assign user to group
    //this.dataService.updateUser()
  }
}
