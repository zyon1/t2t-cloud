import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';

  

import { LoginService } from './login.service';


@Injectable()
export class AuthGuard implements CanActivate {
     constructor(private loginService: LoginService, private router: Router) {
         // console.log("authguard");
     }
 /* canActivate() {
    console.log('AuthGuard#canActivate called');
    //console.log(this.loginService.isLoggedin);
    return true;//this.loginService.isLoggedin;
    
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string):Observable<boolean> {
      // console.log("chk login");
      return Observable.create(observer => {
          let tempState=false;
           return this.loginService.getPermissions().subscribe(loginState => {
              // console.log(loginState);
               if (loginState) {
                   // redirect if user data is not entered
                   if (!loginState.touched){
                       this.router.navigate(['/login/user-data']);
                   }

                   //console.log("state: ", loginState);
                      tempState=true;
               }else{
                   this.loginService.redirectUrl = url;
                   this.router.navigate(['/login']);
               }
               // console.log(tempState);
               observer.next(tempState);
               observer.complete(console.log);
            });
      });
  }
}
@Injectable()
export class AdminGuard implements CanActivate {
     constructor(private loginService: LoginService, private router: Router) {
         console.log("admin guard");
     }
 /* canActivate() {
    console.log('AuthGuard#canActivate called');
    //console.log(this.loginService.isLoggedin);
    return true;//this.loginService.isLoggedin;
    
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let url: string = state.url;
    console.log("canActivate");
    return this.checkLogin(url);
  }

  checkLogin(url: string):Observable<boolean> {
      return Observable.create(observer => {
          let tempState=false;
          console.log("Creating observable");
           this.loginService.getPermissions().subscribe(loginState => {
               console.log(loginState);
               if (loginState) {
                 if (!loginState.touched){
                       this.router.navigate(['/login/user-data']);
                   }

                   console.log("state: ", loginState);
                      tempState=true;
                     
               }else{
                    // Store the attempted URL for redirecting
                      this.loginService.redirectUrl = url;
                      // Navigate to the login page with extras
                      this.router.navigate(['/login']);
               }
               if (!loginState.isAdmin){
                   this.router.navigate(['/error', 403]);
               }
               observer.next(loginState.isAdmin);
               observer.complete();
            });
      });
  }
}
@Injectable()
export class GroupGuard implements CanActivate {
     constructor(private loginService: LoginService, private router: Router) {
         console.log("group guard");
     }
 /* canActivate() {
    console.log('AuthGuard#canActivate called');
    //console.log(this.loginService.isLoggedin);
    return true;//this.loginService.isLoggedin;
    
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let url: string = state.url;
    //console.log("canActivate");
    return this.checkLogin(url);
  }

  checkLogin(url: string):Observable<boolean> {
      return Observable.create(observer => {
          let tempState=false;
          console.log("Creating observable");
           this.loginService.getPermissions().subscribe(loginState => {
               console.log(loginState);
               if (loginState) {
                 if (typeof loginState.group != 'undefined'){
                     console.log(loginState.group);
                       //this.router.navigate(['/login/user-data']);
                       tempState=true;
                       this.router.navigate(['/login/group', loginState.group]);
                   }else{
                     // this.router.navigate(['/error', 403]);
                     // TODO: Finish create group
                     this.router.navigate(['/login/group/new']);
                     console.log("User has no group! Please create group!");
                   }

                   console.log("state: ", loginState);
                      
                     
               }else{
                    // Store the attempted URL for redirecting
                      this.loginService.redirectUrl = url;
                      // Navigate to the login page with extras
                      this.router.navigate(['/login']);
               }

               observer.next(tempState);
               observer.complete();
            });
      });
  }
}
