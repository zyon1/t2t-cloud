import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';
import { FormsModule } from '@angular/forms';

// import { IntraNavComponent} from '../intra-nav/intra-nav.component';
import * as firebase from 'firebase';
/* services */
import { LoginService } from '../login.service';
import { DataService } from '../data.service';
/* classes */
import { User } from '../../common/user';
// import { Credentials } from '../../common/credentials';
class User1{
  constructor(
public name?:string,
public surname?:string,
public oib?:string,
public address?:string,
public postcode?:string,
public city?:string,
public country?:string,
public obrt?:string,
public isAdmin?: string,
public touched?: string,
public activated?: string,
public group?: string
  ){}
}
@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
 user:any=new User1();
 afDisplayName?:string;
 private uid:any;
  constructor(public loginService: LoginService, private router: Router, public dataService: DataService) { 
    this.loginService.getUser().subscribe(user => {
      let tempUser= {
      name: user.name?user.name:null,
surname: user.surname?user.surname:null,
oib: user.oib?user.oib:null,
address: user.address?user.address:null,
postcode: user.postcode?user.postcode:null,
city: user.city?user.city:null,
country: user.country?user.country:null,
obrt: user.obrt?user.obrt:null,
isAdmin:user.isAdmin?user.isAdmin:null,
touched:user.touched?user.touched:null,
group:user.group?user.group:null,
activated:user.activated?user.activated:null
      };
      Object.assign(this.user, tempUser);
      this.uid=user.$key;
      this.loginService.getUser().subscribe(user=>this.afDisplayName=user.displayName);
      // console.log(this.user);
    });
  }
  saveData(){
    this.loginService.updateUser(this.afDisplayName)
    .then(
      response=>{
        //username sucessfuly saved
       // console.log("Success! Firebase user data saved.", response);
      })
    .catch(
        e=>{
          console.error("T2T error:", e);
        });
      //this.dataService.updateUser(this.user);
      let tempUser:any={[this.uid]:{touched:true}};
      Object.assign(tempUser[this.uid], this.user);
      //Object.assign(tempUser, this.loginService.getPermissions());
      // console.log(tempUser);

      this.dataService.updateUser(tempUser);
    //console.log(tempUser);
  }
  ngOnInit() {
  }

}
