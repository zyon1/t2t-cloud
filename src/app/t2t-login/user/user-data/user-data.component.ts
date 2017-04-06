import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';
import { FormsModule } from '@angular/forms';

// import { IntraNavComponent} from '../intra-nav/intra-nav.component';
import * as firebase from 'firebase';
/* services */
import { LoginService } from '../../login.service';
import { DataService } from '../../data.service';
/* classes */
// import { User } from '../../common/user';
// import { Credentials } from '../../common/credentials';
class User {
  constructor(
public isAdmin?: string,
    public touched?: string,
    public activated?: string,
    public group?: string
  ){}
}
class UserData {
  constructor(
    public name?:string,
public surname?:string,
public oib?:string,
public address?:string,
public postcode?:string,
public city?:string,
public country?:string,
public obrt?:string
    
  ){}
}
@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
 user:any=new User();
 userData:any=new UserData();
 afDisplayName?:string;
 private uid:any;
  constructor(public loginService: LoginService, private router: Router, public dataService: DataService) {
    // TODO: form validation
    // subscribe on loggedUserData
    // if there is data corresponding to userStructure create temp user Object

    this.dataService.getUserData().subscribe(userData => {
       let tempUserData= {
        email: userData.email?userData.email:null,
        name: userData.name?userData.name:null,
        surname: userData.surname?userData.surname:null,
        oib: userData.oib?userData.oib:null,
        address: userData.address?userData.address:null,
        postcode: userData.postcode?userData.postcode:null,
        city: userData.city?userData.city:null,
        country: userData.country?userData.country:null,
        obrt: userData.obrt?userData.obrt:null
      };
        console.log(tempUserData);
        // assign fetched data to userData object (automaticly fill the userData form)
        Object.assign(this.userData, tempUserData);
        this.uid=userData.$key;
        this.loginService.getUser().subscribe(user=>{
        console.log(user);
        this.userData.email=user.email;
        this.afDisplayName=user.displayName});
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
      console.log('tempUserData', this.userData);
      let tempUserData:any={[this.uid]:{}};
      // assign new data to new object wich is ready for update
      // assign is needed to drop methods from object
      Object.assign(tempUserData[this.uid], this.userData);
      console.log('tempUserData', tempUserData);
     // update data then mark that user data has been filled
      this.dataService.updateUserData(tempUserData);
      this.dataService.updateUser({touched:true}, this.uid);
    //console.log(tempUser);
  }
  ngOnInit() {
  }

}
