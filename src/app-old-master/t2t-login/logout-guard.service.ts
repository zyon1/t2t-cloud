import 'rxjs/Rx';
import { Injectable } from '@angular/core';
// import {Observable, Subject} from 'rxjs/Rx';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import { LoginService } from './login.service';
@Injectable()
export class LogoutGuard implements CanActivate {
     constructor(private loginService: LoginService, private router: Router) {}
 /* canActivate() {
    console.log('AuthGuard#canActivate called');
    //console.log(this.loginService.isLoggedin);
    return true;//this.loginService.isLoggedin;
    
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.loginService.logout();
    this.router.navigate(['/login']);
    return true;
  }

          // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;
    // Navigate to the login page with extras
    // this.router.navigate(['/login']);
    // return false;
  }
