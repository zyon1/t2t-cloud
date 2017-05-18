/* source modules*/
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Router }    from '@angular/router';
import { IntraNavComponent} from '../intra-nav/intra-nav.component';
import * as firebase from 'firebase';


/* services */
import { LoginService } from '../login.service';
import { DataService } from '../data.service';


/* classes */
//import { User } from '../../common/user';
// import { Credentials } from '../../common/credentials';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
   //x:any;
   loading:boolean=false;
  /*user: Credentials = {
    email: "",
    password: ""
  };*/
 
   
  
  constructor ( public loginService: LoginService, private router: Router, public dataService: DataService ) {
            // this.x=this.loginService.authenticated;
            // this.loginService.asyncState().subscribe( v => this.x = v);
            
        this.loginService.getLoggedUser().subscribe(auth => {if(auth){      this.router.navigate(['/auth','user', auth.uid]);
}});  
                  }
  login( email: string, password: string ) {
    this.loginService.login(email, password).then(r=>{
     // console.log("Korisnik prijavljen", r);
      //this.router.navigate([this.loginService.redirectUrl]);
      let logData = {uid: r.uid, event: 'Korinsik prijavljen', time: firebase.database['ServerValue']['TIMESTAMP'] };
      //this.dataService.addAction(logData).subscribe(console.log);
      //this.router.navigateByUrl('http://localhost:4200/auth/user/'+r.uid);
      //window.location.href='auth/user/'+r.uid;
//this.router.navigate([])
      this.router.navigate(['/auth','user', r.uid]);
      //console.log("login fn completed");
    });
  }
   register(email: string, password: string) {
     this.loading=true;
    this.loginService.register(email, password).then(
        response => {
         // console.log(response);
          let userData = {[response.uid]: {email: email, isAdmin: false,
                touched: false,
                activated: false,
                created: firebase.database['ServerValue']['TIMESTAMP']
            }};
          let logData = {uid: response.uid, event: 'Kreiran korisnički račun', time: firebase.database['ServerValue']['TIMESTAMP'] };
          this.dataService.addUser(userData).subscribe(v => {
            // console.log(v);
            if (v) { this.dataService.addAction(logData).subscribe(x => {
              console.log(x);

            this.router.navigate(['/auth/data']);  
            });
              // console.log(logData);
            }else {
              // v=false error logged in console.
              // same goes for addAction.subscribe(x=>...)
            }
          });
          // redirect to user-data
          this.loading=false;
        }).catch(
      error => {
        console.log(error);
      }
    );
  }
  logout(){
     window.location.href='/login/logout';
        
  }
  ngOnInit() {

  }

  
}
