import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Router }    from '@angular/router';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
//import { FirebaseAuth } from 'angularfire2';
import * as firebase from 'firebase';


import { User } from '../common/user';
// import { Credentials } from '../common/credentials';

@Injectable()
export class LoginService {
    redirectUrl: string = '/login';
    
    constructor(  public af: AngularFire, private router: Router) {
    }
    login( email: string, password: string) {
        this.af.auth.login({
            email: email,
            password: password,
        },
        {
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
        })
            .then( function() {
            }
            ).catch(function(e ) {
             console.log('Error' + e);
            });
    }
   register( email: string, password: string): firebase.Promise<FirebaseAuthState> {
        return this.af.auth.createUser( { email: email, password: password } );
    }
    updateUser( displayName: string, photoURL?: string ): firebase.Promise<FirebaseAuthState>{
        return firebase.auth().currentUser.updateProfile({displayName:displayName, photoURL:photoURL?photoURL:null});
 
    }
    logout() {
        this.af.auth.logout();
    }
    public getPermissions(): any {
        return Observable.create( observer => {
            let tempPermissions: any;
            this.af.auth.subscribe(auth => {
                // console.log(auth);
                tempPermissions = { };
                if (auth)
                {this.af.database.object('/users/' + auth.uid).subscribe( snap => {
                    Object.assign( tempPermissions, {
                        isAdmin: snap.isAdmin,
                        touched: snap.touched,
                        activated: snap.activated,
                        group: snap.group,
                        grouptype: snap.grouptype
                    });
                    observer.next(tempPermissions);
                    observer.complete();
                    // console.log(tempPermissions);
                });
            } else { 
                tempPermissions=false;
                observer.next(tempPermissions);
                observer.complete();
            }
            });
        });
    }
    public getUser(): any {
        return Observable.create( observer => {
            let tempFBUser: any;
            this.af.auth.subscribe(auth => {
                tempFBUser = { email: auth.auth.email, displayName: auth.auth.displayName };
                this.af.database.object('/users/' + auth.uid).subscribe( snap => {
                    Object.assign(tempFBUser, snap);
                    observer.next(tempFBUser);
                    observer.complete();
                });
            });
        });
    }
     public asyncState(): Observable<any> {
        {
    return Observable.create( observer => {
        this.af.auth.subscribe(auth => {
            let isLoggedIn = auth !== null;
            if (isLoggedIn) {
                 // this.router.navigate([this.redirectUrl]);
            }
            observer.next( isLoggedIn );
        });
        });
    }
    };
}
