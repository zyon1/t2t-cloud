/* system*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from 'angular2-google-maps/core';

/* overrider */
import { NgbDateMomentParserFormatter } from './date-picker/ngb-datepicker-parser-formatter';
/* Modules */
import { AppRoutingModule } from './app-routing.module';
/* Services */
import { PaginationService } from './pagination.service';
/* Pipes */
import { MultiFilterPipe } from './multifilter.pipe';
import  { OrderByPropertyPipe } from './order-by-property.pipe';
/* Components */
import { ErrorsComponent } from './errors/errors.component';
import { AppComponent } from './app.component';
import { RootNavigationComponent } from './root-navigation/root-navigation.component'; // main navigation
// pages...
import { HomepageComponent } from './homepage/homepage.component';
import { ProjectComponent } from './project/project.component';
import { PricesComponent } from './prices/prices.component';
import { AboutComponent } from './about/about.component';
import { IntraNavComponent } from './t2t-login/intra-nav/intra-nav.component';
import { PopupComponent } from './popup/popup.component';
export function ngbdmpf() {
  return new NgbDateMomentParserFormatter("DD-MM-YYYY");
}
@NgModule({
  declarations: [
    AppComponent,
    RootNavigationComponent,
    HomepageComponent,
    ProjectComponent,
    PricesComponent,
    AboutComponent,
    ErrorsComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBK5kZUnD5OtI2Zupbg1YohUdqkU7DvuOI',
      libraries: ['places']
    })
  ],
  providers: [PaginationService, { 
      provide: 'NgbDateParserFormatter', 
      useFactory: ngbdmpf
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
