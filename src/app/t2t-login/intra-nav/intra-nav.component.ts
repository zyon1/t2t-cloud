import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { Observable } from 'rxjs/Rx';
import { DataService } from '../data.service';

@Component({
  selector: 'app-intra-nav',
  templateUrl: './intra-nav.component.html',
  styleUrls: ['./intra-nav.component.css']
})
export class IntraNavComponent implements OnInit {
  loggedIn:any;
  groups:any;
  user:any;
    public fullPath:string;

getMyPicture(myPicture){
   this.fullPath = "../../../../img/"+ myPicture;
 }
  constructor(private route: ActivatedRoute, private router: Router, private gs: GroupService, private ls: LoginService, private datas: DataService) {
    // console.log(ars);
    // this.router.navigate([{ outlets: { sidebar: 'sidebar' }}]);
        this.getMyPicture('Logo_final_all-14.png');
this.datas.getUserNew().subscribe(user=>{
this.user=user;
//console.log(user);
if (user && user.uid){
  this.loggedIn=true;        
      this.gs.getGroups(user.uid).subscribe(groups => this.groups=groups);
     // this.gs.getMyGroups2().subscribe(x=> console.log)
}
});    
  /*  this.ls.getLoggedUser().subscribe(
      user => {
        console.log(user);
        if (user){
          let tmpGroups=[];
        this.groups=this.gs.getGroups(user.uid);

        this.loggedIn=true;
      

  
}
      }
    );*/
    
    
   }

  ngOnInit() {

  }

}


        