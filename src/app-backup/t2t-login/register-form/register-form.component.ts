import { Component, OnInit, Input } from '@angular/core';
// import { FormsModule }   from '@angular/forms';
import { Router }    from '@angular/router';
// import { IntraNavComponent} from '../intra-nav/intra-nav.component';
import * as firebase from 'firebase';
/* services */
import { LoginService } from '../login.service';
import { DataService } from '../data.service';
/* classes */
import { User } from '../../common/user';
// import { Credentials } from '../../common/credentials';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
x: any;
  constructor(public loginService: LoginService, private router: Router, public dataService: DataService) {
     this.loginService.asyncState().subscribe(v => this.x = v);
   }
   register(email: string, password: string) {
    this.loginService.register(email, password).then(
        response => {
          console.log(response);
          let userData = {[response.uid]: {email: email, isAdmin: false,
                touched: false,
                activated: false,
                created: firebase.database['ServerValue']['TIMESTAMP']
            }};
           let logData = {email: email, event: 'Kreiran korisnički račun', time: firebase.database['ServerValue']['TIMESTAMP'] };
          this.dataService.addUser(userData).subscribe(v => {
            // console.log(v);
            if (v) { this.dataService.addAction(logData).subscribe(x => {console.log(x) 
            this.router.navigate(['/login/register/user-data']);  
            });
              // console.log(logData);
            }else {
              // v=false error logged in console.
              // same goes for addAction.subscribe(x=>...)
            }
          });
          // redirect to user-data
        }).catch(
      error => {
        console.log(error);
      }
    );
  }
  logout() {
     window.location.href = '/login/logout';
  }
  ngOnInit() {
  }
}
