/* system*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
    ErrorsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [PaginationService, { 
      provide: 'NgbDateParserFormatter', 
      useFactory: ngbdmpf 
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
