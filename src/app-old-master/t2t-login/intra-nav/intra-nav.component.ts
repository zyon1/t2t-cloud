import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-intra-nav',
  templateUrl: './intra-nav.component.html',
  styleUrls: ['./intra-nav.component.css']
})
export class IntraNavComponent implements OnInit {
  loggedIn:any;
  email:any;
  constructor(private loginService:LoginService) {
    this.loginService.asyncState().subscribe(state => {this.loggedIn=state;
    if (state){
      this.loginService.getUser().subscribe(user=>this.email=user.email);
    }  
     });
    
    
   }

  ngOnInit() {
  }

}
