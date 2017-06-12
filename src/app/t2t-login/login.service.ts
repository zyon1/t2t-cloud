import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';

//import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
//import { FirebaseAuth } from 'angularfire2';
//import * as firebase from 'firebase';
//import { User } from '../common/user';
// import { Credentials } from '../common/credentials';
@Injectable()
export class LoginService {
    redirectUrl: string;
    uid:string;
    userData:any;
    uid$:any;
    constructor(  private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
        this.uid$=this.afAuth.authState.map(auth => {
            return auth.uid; 
        });
        this.afAuth.authState.subscribe(auth => {
            if (auth){
this.uid=auth.uid;
}
        })
    }
    // login izgleda u redu
    // TODO: dodati actionLog za akciju
    login( email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
        
        /*
        return this.af.auth.login( {
            email: email,
            password: password,
        },
        {
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
        });*/
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
   register( email: string, password: string): any {

        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        //.auth.createUser( { email: email, password: password } );
    }
// update firebase usera
    updateUser( displayName: string, photoURL?: string ):any{
        return firebase.auth().currentUser.updateProfile( {displayName: displayName, photoURL: photoURL ? photoURL : null } );
    }
    // seems fine
    logout() {
        return this.afAuth.auth.signOut();
    }
    // TODO: after data restructuring change function to getUser()
    // untested
    getPermissionsNew(){
        let tempPermissions: any;
        return this.afAuth.authState.flatMap(auth => {
             tempPermissions = { };
                if (auth){
                    return this.db.object('/users/' + auth.uid);
                }
                else{
                }
        });
    }
    /*
    public getPermissions(): any {
        return Observable.create( observer => {
            let tempPermissions: any;
            this.afAuth.authState.subscribe(auth => {
                // console.log(auth);
                tempPermissions = { };
                if (auth)
                {this.db.object('/users/' + auth.uid).subscribe( snap => {
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
    }*/
    public getLoggedUser(): any{
        return this.afAuth.authState;
    }
    // deprecated -> call method from data service
    
    /*

    public getUser(): any {
        return Observable.create( observer => {
            let tempFBUser: any;
            this.afAuth.authState.subscribe(auth => {
                tempFBUser = { email: auth.email, displayName: auth.displayName };
                this.db.object('/users/' + auth.uid).subscribe( snap => {
                    Object.assign(tempFBUser, snap);
                    observer.next(tempFBUser);
                    observer.complete();
                });
            });
        });
    }*/

    // Deprecated
    // TODO: check if function is used anywhere
    /*
    asyncStateNew(){
        return this.afAuth.authState.map( auth => {
            if (auth){
                return true;
            }else{
                return false;
            }
        });
    }*/
    /*
     public asyncState(): Observable<any> {
        {
    return Observable.create( observer => {
        this.afAuth.authState.subscribe(auth => {
            let isLoggedIn = auth !== null;
            if (isLoggedIn) {
                 // this.router.navigate([this.redirectUrl]);
            }
            observer.next( isLoggedIn );
        });
        });
    }
};*/

}
