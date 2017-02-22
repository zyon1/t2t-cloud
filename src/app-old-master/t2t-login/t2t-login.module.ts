import 'rxjs/Rx';
/* core modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
/* override */
// import { NgbDateMomentParserFormatter } from '../date-picker/ngb-datepicker-parser-formatter';

/* routing moudle */
import { LoginRouting } from './login-routing.module';
/* list of firebase modules */
import { AngularFireModule, AuthProviders, AuthMethods, FirebaseAuthState  } from 'angularfire2';
/* services  */
import { AuthGuard, AdminGuard, GroupGuard } from './auth-guard.service';
import { LogoutGuard } from './logout-guard.service';
import { LoginService } from './login.service';
import { DataService } from './data.service';

/* components */
import { T2tLoginComponent } from './t2t-login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { AdminComponent } from './admin/admin.component';
import { UserDataComponent } from './user-data/user-data.component';
import { GroupComponent } from './group/group.component';
import { IntraNavComponent } from './intra-nav/intra-nav.component';
import { DualDatePickerComponent } from '../date-picker/date-picker.component';
import { SidebarComponent } from './sidebar/sidebar.component';
//import { NgbdDatepickerI18n1 } from './date-picker-i18n/date-picker-i18n.component';
import { CreateGroupComponent } from './create-group/create-group.component';

/* Classes */


export const myFirebaseConfig = {
    apiKey: 'AIzaSyDBt-jj4iN8rZZt2h0yoiISdFXtf_9blCU',
    authDomain: 't2t-cloud-325cd.firebaseapp.com',
    databaseURL: 'https://t2t-cloud-325cd.firebaseio.com',
    storageBucket: 't2t-cloud-325cd.appspot.com',
    messagingSenderId: '108080425518'
  };
export const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};
@NgModule({
  imports: [
    CommonModule,
    LoginRouting,
    AngularFireModule.initializeApp(myFirebaseConfig, myFirebaseAuthConfig),
    FormsModule,
    DatepickerModule,
    NgbModule
  ],
  declarations: [
    T2tLoginComponent,
    LoginFormComponent,
    RegisterFormComponent,
    AdminComponent,
    UserDataComponent,
    GroupComponent,
    IntraNavComponent,
    DualDatePickerComponent,
    SidebarComponent,
  //  NgbdDatepickerI18n1,
    CreateGroupComponent],
  providers: [ LoginService, DataService, AuthGuard, LogoutGuard, AdminGuard, GroupGuard]
})
export class T2tLoginModule {
  // x=console.log("login module loaded");
 }
