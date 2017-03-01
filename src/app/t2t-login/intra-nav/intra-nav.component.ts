import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { LoginService } from '../login.service';
import { GroupService } from '../group.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-intra-nav',
  templateUrl: './intra-nav.component.html',
  styleUrls: ['./intra-nav.component.css']
})
export class IntraNavComponent implements OnInit {
  loggedIn:any;
  email:any;
  private uid:any;
  groups:any;
  gid:any;
  sidebar:any;
    public fullPath:string;

getMyPicture(myPicture){
   this.fullPath = "../../../../img/"+ myPicture;
 }
  constructor(private route: ActivatedRoute, private router: Router, private gs: GroupService, private ls: LoginService) {
    // console.log(ars);
    // this.router.navigate([{ outlets: { sidebar: 'sidebar' }}]);
        this.getMyPicture('Logo_final_all-14.png');

    
    this.ls.getLoggedUser().subscribe(
      user => {
        if (user){
          let tmpGroups=[];
          // this.gs.getGroupsWithData2(user.uid).subscribe(v=>console.log(v));
        this.groups=this.gs.getGroups(user.uid);
        this.gid=user.primaryGroup
        this.email=user.auth.email;
        this.uid=user.uid;
        this.loggedIn=true;
      
      let routerSS=this.router.routerState.snapshot.url;
   if(routerSS.search('group')>-1 &&  routerSS.search('groups')==-1 ){
    this.sidebar=[
      {link:'user', text:'Pregled'},
      {link:'user/'+this.uid+'/groups', text:'Grupe'},
      {link:'new-group', text:'Napravi novu grupu'}
      ];


   }else{
    
    this.sidebar=[
      {link:'user', text:'Pregled'},
      {link:'user/'+this.uid+'/groups', text:'Grupe'},
      {link:'new-group', text:'Napravi novu grupu'}
      ];
    }
  
}
      }
    );
    
    
   }

  ngOnInit() {

  }

}


        