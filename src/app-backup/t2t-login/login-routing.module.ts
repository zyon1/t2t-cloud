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
import { CreateGroupComponent } from './create-group/create-group.component';


const loginRoutes: Routes = [
    { path: '', 
    component: LoginFormComponent },
    {path: 'logout', canActivate:[LogoutGuard], component: LoginFormComponent},
    { path: 'user-data', canActivate:[AuthGuard], component: UserDataComponent },
    { path: 'register',  children: [
           { path: '', component: RegisterFormComponent },
           { path: 'user-data', canActivate:[AuthGuard], component: UserDataComponent } 
        ]

    },
    { path: 'group',  children: [
           { path: '', canActivate: [GroupGuard], component: GroupComponent },
           { path: '/:id', canActivate: [GroupGuard], component: GroupComponent } ,
           { path: 'new', component: CreateGroupComponent }
        ]
    },
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


export const LoginRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);

