/* source */
import { NgModule }             from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
/* services */
import { AuthGuard, AdminGuard, GroupGuard }                from './auth-guard.service';
import { LogoutGuard }                from './logout-guard.service';

import { HavePermissionGuardService} from './have-permission-guard.service';
/* components */
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { UserDataComponent } from './user/user-data/user-data.component';
import { AdminComponent } from './admin/admin.component';
import { GroupComponent } from './group/group.component';
import { UnitsComponent } from './group/units/units.component';
import { NewObjectComponent } from './object/new-object/new-object.component';
import { ObjectDataComponent } from './object/object-data/object-data.component';
import { UnitsWizardComponent} from './units-wizard/units-wizard.component';
import { InviteComponent } from './group/invite/invite.component';
import { ObjectPoliciesComponent } from './object/object-policies/object-policies.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IntraNavComponent } from './intra-nav/intra-nav.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ObjectUnitsComponent } from './unit/object-units/object-units.component';
import { UnitBasicComponent } from './unit/unit-basic/unit-basic.component';
import { UnitKitchenComponent } from './unit/unit-kitchen/unit-kitchen.component';
import { UnitEquipmentComponent } from './unit/unit-equipment/unit-equipment.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ObjectPicsComponent } from './object/object-pics/object-pics.component';
import { UnitPicsComponent } from './unit/unit-pics/unit-pics.component';
import { UnitRoomsComponent } from './unit/rooms/unit-rooms.component';
import { UnitPricesComponent} from './unit-prices/unit-prices.component';
import { MyObjectsComponent } from './my-objects/my-objects.component';
import { UnitPreviewComponent } from './unit-preview/unit-preview.component';

const loginRoutesNew: Routes = [
   { path: '', component: IntraNavComponent, canActivateChild:[], children: [
        {path: '', component: LoginFormComponent },
        {path: 'side', component: SidebarComponent, outlet:'sidebar'},
        {path: 'logout', canActivate:[LogoutGuard], component: LoginFormComponent },
        { path: 'user', children:[
            { path: '', canActivate: [AuthGuard], component: DashboardComponent },
            { path: ':id', children:[
                { path: '', component: DashboardComponent },
                { path: 'side', component: SidebarComponent, outlet: 'sidebar' },
                { path: 'groups', component: MyGroupsComponent },
                { path: 'new-group', component: CreateGroupComponent },
                { path: 'group', canActivate: [GroupGuard], children:[
                    { path: ':gid', children:[
                        { path: '', component: GroupComponent },
                        { path: 'side', component: SidebarComponent, outlet: 'sidebar' },
                        { path: 'units', children:[
                            { path: '', component: UnitsComponent},
                            { path: 'object', children:[
                                { path: ':oid', component: UnitsWizardComponent, children:[
                                    { path: '', component: NewObjectComponent },
                                    { path: 'data', component: ObjectDataComponent },
                                    { path: 'policies', component: ObjectPoliciesComponent },
                                    { path: 'pics', component: ObjectPicsComponent },
                                    { path: 'units', children:[
                                        { path: '', component: ObjectUnitsComponent },
                                        { path: ':unid', children:[
                                            { path: '', component: UnitBasicComponent},
                                            { path: 'kb', component: UnitKitchenComponent},
                                            { path: 'eq', component: UnitEquipmentComponent },
                                            { path: 'pics', component: UnitPicsComponent },
                                            { path: 'rooms', component: UnitRoomsComponent },
                                            { path: 'prices', component: UnitPricesComponent }

                                           /*
                                          //Prvi koncept za popunjavanje soba, možda ćemo se vratiti na njega poslije ljeta
                                            { path: 'rooms', children: [
                                                { path: '', component: RoomsComponent }

                                            ] }
                                            */
                                ] },
                            ] }
                                ] },
                                
                            ] },
                        ]},
                        { path: 'invite', component: InviteComponent } 
                    ]},
                ] },
                { path: 'view-unit', children:[
                    {path: ':unid', component: UnitPreviewComponent}
                ] },
                { path: 'my-objects', component: MyObjectsComponent},
                { path: 'object', children:[
                    {path: ':oid', canActivate:[HavePermissionGuardService]}
                ]}
            ] },
        ] },
        { path: 'admin', canActivate:[AdminGuard], component: AdminComponent},
        { path: 'new-group', canActivate: [AuthGuard], component: CreateGroupComponent },
        { path: 'data', canActivate: [AuthGuard], component: UserDataComponent },
        { path: 'sidebar', component: SidebarComponent, outlet: 'sidebar' }
   ]},
   {
  path: 'side',
  component: SidebarComponent,
  outlet: 'sidebar'
},


];
const loginRoutes: Routes = [
    { path: '', 
    component: LoginFormComponent },
    {path: 'logout', canActivate:[LogoutGuard], component: LoginFormComponent},
    // {path: 'dash', canActivate:[AuthGuard], component: DashboardComponent},
    { path: 'user-data', canActivate:[AuthGuard], component: UserDataComponent },
    { path: 'register',  children: [
           { path: '', component: RegisterFormComponent },
           { path: 'user-data', canActivate:[AuthGuard], component: UserDataComponent } 
        ]

    },
     { path: 'intra', component: IntraNavComponent,  children: [
          {path: '', component: LoginFormComponent },
           { path: 'user/:id', component: DashboardComponent },
           { path: 'user/:uid/group/:gid', component: GroupComponent },
           { path: 'user/:uid/groups', component: MyGroupsComponent } ,
           { path: 'group/new', component: IntraNavComponent }
        ]
    },
    /* { path: 'group',  children: [
           { path: '', canActivate: [GroupGuard], component: GroupComponent },
           { path: 'id/:id', component: GroupComponent } ,// canActivate memberGuard after it is finished
           { path: 'new', canActivate: [AuthGuard], component: CreateGroupComponent }
        ]
    },*/
    { path: 'admin', 
    canActivate: [AdminGuard],
    pathMatch: 'full',
    children: [
      {
        path: '',
        children: [
          // { path: 'heroes', component: ManageHeroesComponent },
           { path: '', component: AdminComponent } // this is just for the testing fase of admin guard
        ]
      }
    ]

}
    
 
];

export const appRoutingProviders: any[] = [

];
export const LoginRouting: ModuleWithProviders = RouterModule.forChild(loginRoutesNew);

