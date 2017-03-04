/* source */
import { NgModule }             from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
/* services */
import { AuthGuard, AdminGuard, GroupGuard }                from './auth-guard.service';
import { LogoutGuard }                from './logout-guard.service';
/* components */
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { UserDataComponent } from './user-data/user-data.component';
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
const loginRoutesNew: Routes = [
   { path: '', component: IntraNavComponent, canActivateChild:[], children: [
        {path: '', canActivate: [], component: LoginFormComponent },
        {path: 'side', component: SidebarComponent, outlet:'sidebar'},
        {path: 'logout', canActivate:[LogoutGuard], component: LoginFormComponent },
        { path: 'user', children:[
            { path: '', canActivate: [AuthGuard], component: DashboardComponent },
            { path: ':id', canActivate: [], children:[
                              

                { path: '', canActivate: [], component: DashboardComponent },
                { path: 'side', component: SidebarComponent, outlet: 'sidebar' },
                { path: 'groups', canActivate: [], component: MyGroupsComponent },
                                

                { path: 'new-group', canActivate: [], component: CreateGroupComponent },

                { path: 'group', canActivate: [GroupGuard], children:[
                    { path: ':gid', canActivate: [], children:[
                        { path: '', canActivate: [], component: GroupComponent },
                        { path: 'side', component: SidebarComponent, outlet: 'sidebar' },

                        { path: 'units', canActivate: [], children:[
                            { path: '', canActivate: [], component: UnitsComponent},
                            { path: 'object', canActivate:[], children:[
                                { path: ':oid', canActivate:[], component: UnitsWizardComponent, children:[
                                    { path: '', canActivate:[], component: NewObjectComponent },
                                    { path: 'data', canActivate:[], component: ObjectDataComponent },
                                    { path: 'policies', canActivate:[], component: ObjectPoliciesComponent },
                                    { path: 'unit', canActivate:[], children:[
                                        { path: ':unid', canActivate:[], component: UnitsWizardComponent, children:[
                                            { path: '', canActivate:[], component: ObjectUnitsComponent },
                                            { path: 'data', canActivate:[], component: ObjectDataComponent },
                                            { path: 'policies', canActivate:[], component: ObjectPoliciesComponent }

                                ] },
                            ] }
                                ] },
                                
                            ] },
                        ]},
                        
                        
                        { path: 'invite', canActivate:[], component: InviteComponent } 
                    ]},
                ] },
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
          {path: '', canActivate: [], component: LoginFormComponent },
           { path: 'user/:id', canActivate: [], component: DashboardComponent },
           { path: 'user/:uid/group/:gid', canActivate: [], component: GroupComponent },
           { path: 'user/:uid/groups', canActivate: [], component: MyGroupsComponent } ,
           { path: 'group/new', canActivate: [], component: IntraNavComponent }
        ]
    },
    /* { path: 'group',  children: [
           { path: '', canActivate: [GroupGuard], component: GroupComponent },
           { path: 'id/:id', canActivate: [], component: GroupComponent } ,// canActivate memberGuard after it is finished
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

