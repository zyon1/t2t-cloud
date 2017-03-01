import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
//import { FirebaseAuth } from 'angularfire2';
import * as firebase from 'firebase';
//import { User } from '../common/user';
// import { Credentials } from '../common/credentials';
@Injectable()
export class LoginService {
    redirectUrl: string;
    constructor(  public af: AngularFire) {
    }
    // login izgleda u redu
    // TODO: dodati actionLog za akciju
    login( email: string, password: string) {
        return this.af.auth.login( {
            email: email,
            password: password,
        },
        {
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
        });
           /* .then( response => { 
                // tu se generiraju podaci za actionLog
                console.log(response);
            })
            .catch( e => {
             console.log( 'Error' + e );
            })
            */
    }
    // podaci za action log u login-form komponenti
   register( email: string, password: string): firebase.Promise<FirebaseAuthState> {

        return this.af.auth.createUser( { email: email, password: password } );
    }
// update firebase usera
    updateUser( displayName: string, photoURL?: string ): firebase.Promise<FirebaseAuthState>{
        return firebase.auth().currentUser.updateProfile( {displayName: displayName, photoURL: photoURL ? photoURL : null } );
    }
    // seems fine
    logout() {
        return this.af.auth.logout();
    }
    // TODO: after data restructuring change function to getUser()
    // untested
    getPermissionsNew(){
        let tempPermissions: any;
        return this.af.auth.flatMap(auth => {
             tempPermissions = { };
                if (auth){
                    return this.af.database.object('/users/' + auth.uid);
                }
                else{
                }
        });
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
    public getLoggedUser(): any{
        return this.af.auth;
    }
    // deprecated -> call method from data service
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
    // Deprecated
    // TODO: check if function is used anywhere
    asyncStateNew(){
        return this.af.auth.map( auth => {
            if (auth){
                return true;
            }else{
                return false;
            }
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
