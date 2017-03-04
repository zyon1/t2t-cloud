import 'rxjs/Rx';
/* core modules */
import { NgModule, ModuleWithProviders, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerModule } from 'ng2-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AgmCoreModule } from 'angular2-google-maps/core';
/* override */
// import { NgbDateMomentParserFormatter } from '../date-picker/ngb-datepicker-parser-formatter';
/* routing moudle */
import { LoginRouting, appRoutingProviders } from './login-routing.module';
/* list of firebase modules */
import { AngularFireModule, AuthProviders, AuthMethods, FirebaseAuthState  } from 'angularfire2';
/* services  */
import { AuthGuard, AdminGuard, GroupGuard } from './auth-guard.service';
import { LogoutGuard } from './logout-guard.service';
import { LoginService } from './login.service';
import { DataService } from './data.service';
import { GroupService } from './group.service';
import { WatchingService } from './watching.service';
import { ChatService } from './chat.service';
import { UnitsService } from './units.service';

import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core/services';

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
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './group/overview/overview.component';
import { ActionsComponent } from './group/actions/actions.component';
import { MembersComponent } from './group/members/members.component';
import { ContentComponent } from './group/content/content.component';
import { UnitsComponent } from './group/units/units.component';
import { InviteComponent } from './group/invite/invite.component';
import { WatcherComponent } from './watcher/watcher.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { ChatComponent } from './chat/chat.component';
import { SearchComponent } from './search/search.component';
import { BoxComponent } from './box/box.component';
import { NewObjectComponent } from './object/new-object/new-object.component';
import { MapComponent } from './map/map.component';
import { T2tValidatorDirective } from './t2t-validator.directive';
import { CustomFormControlComponent } from './custom-form-control/custom-form-control.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { StandardPickerComponent } from './standard-picker/standard-picker.component';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { ObjectDataComponent } from './object/object-data/object-data.component';
import { FormInputArrayComponent } from './form-input-array/form-input-array.component';
import { ObjectPoliciesComponent } from './object/object-policies/object-policies.component';
import { CancelationPoliciesComponent } from './cancelation-policies/cancelation-policies.component';
import { UnitDataComponent } from './unit-data/unit-data.component';
import { UnitBasicComponent } from './unit-data/unit-basic/unit-basic.component';
import { UnitKitchenComponent } from './unit-data/unit-kitchen/unit-kitchen.component';
import { UnitBathroomComponent } from './unit-data/unit-bathroom/unit-bathroom.component';
import { UnitHvacComponent } from './unit-data/unit-hvac/unit-hvac.component';
import { UnitMultimediaComponent } from './unit-data/unit-multimedia/unit-multimedia.component';
import { UnitEquipmentComponent } from './unit-data/unit-equipment/unit-equipment.component';
import { UnitsWizardComponent } from './units-wizard/units-wizard.component';
import { ObjectUnitsComponent } from './unit/object-units/object-units.component';


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
    NgbModule,
    AgmCoreModule
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
    //NgbdDatepickerI18n1,
    CreateGroupComponent,
    DashboardComponent,
    OverviewComponent,
    ActionsComponent,
    MembersComponent,
    ContentComponent,
    UnitsComponent,
    WatcherComponent,
    InviteComponent,
    WatcherComponent,
    MyGroupsComponent,
    LoadingIndicatorComponent,
    ChatComponent,
    SearchComponent,
    BoxComponent,
    NewObjectComponent,
    MapComponent,
    T2tValidatorDirective,
    CustomFormControlComponent,
    CustomSelectComponent,
    StandardPickerComponent,
    LocationPickerComponent,
    ObjectDataComponent,
    FormInputArrayComponent,
    ObjectPoliciesComponent,
    CancelationPoliciesComponent,
    UnitDataComponent,
    UnitBasicComponent,
    UnitKitchenComponent,
    UnitBathroomComponent,
    UnitHvacComponent,
    UnitMultimediaComponent,
    UnitEquipmentComponent,
    UnitsWizardComponent,
    ObjectUnitsComponent
    ],
  providers: [ LoginService, DataService, AuthGuard, LogoutGuard, AdminGuard, GroupGuard, GroupService, WatchingService, ChatService, appRoutingProviders, UnitsService, GoogleMapsAPIWrapper]
})
export class T2tLoginModule {
  // x=console.log("login module loaded");
 }
