import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorsComponent } from './errors/errors.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProjectComponent } from './project/project.component';
import {PricesComponent} from './prices/prices.component';
import {AboutComponent} from './about/about.component';
import { PopupComponent } from './popup/popup.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'error/:id', component: ErrorsComponent },
  { path: 'home',  component: HomepageComponent },
  { path: 'project', component: ProjectComponent},
  { path: 'prices', component: PricesComponent},
  { path: 'about', component: AboutComponent},
  { path: 'login', loadChildren: 'app/t2t-login/t2t-login.module#T2tLoginModule' },
  { path: 'auth', loadChildren: 'app/t2t-login/t2t-login.module#T2tLoginModule' },
  { path: 'popup', component: PopupComponent, outlet: 'popup'}
  ];
@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

