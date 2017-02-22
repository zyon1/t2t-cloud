import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { DataService } from '../data.service';
import { IntraNavComponent} from '../intra-nav/intra-nav.component';
import { PaginationService } from '../../pagination.service';
import { MultiFilterPipe } from '../../multifilter.pipe';
import { OrderByPropertyPipe } from '../../order-by-property.pipe';
import { DualDatePickerComponent } from '../../date-picker/date-picker.component';
import { SidebarComponent } from '../sidebar/sidebar.component';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
test1:any;
actions:any;
noPages:number;
currentPage:number=1;
paginationComplete:boolean=false;
initLength:number;
initArray:any[];
startDate:number=null;
endDate:number=null;

  constructor(public loginService: LoginService, public dataService: DataService, public paginationService:PaginationService) {
    this.loginService.getUser().subscribe(user=>{
      //this.test1=user;
      //ovaj subscribe je beskoristan
    });

    this.dataService.getAllActions().subscribe(actions => {
      this.initLength=actions.length;
      actions=actions.reverse();
      this.initArray=actions;
      this.paginationService.paginate(10, actions);
      this.actions=this.paginationService.goToPage(1);
      this.noPages=this.paginationService.noPages;
      this.paginationComplete=true;


             });

   
  //this.loginService.getPermissions().subscribe();
 }
 goToPage(page:number){
   //console.log(this.paginationComplete);
   if (this.paginationComplete){
     
   
    this.actions=this.paginationService.goToPage(page);
   this.currentPage=page;}
 }
 applyFilter(username, email, event){
   //console.log(username, email, event);
   let tempArray=this.initArray;
   //console.log("start", this.startDate, "end", this.endDate);
   if (this.startDate!=null && this.endDate!=null){
   let timeInterval={eqStart:true, eqEnd:true, iStart:this.startDate, iEnd:this.endDate};
   //console.log('ti',timeInterval);
   tempArray=new MultiFilterPipe().transform(tempArray, { email: email, event: event, time: timeInterval});
   }
   else{
     tempArray=new MultiFilterPipe().transform(tempArray, { email: email, event: event});
   }
   
   //this.test1=tempArray;
   this.initLength=tempArray.length;
   this.paginationService.paginate(10, tempArray );
   this.actions=this.paginationService.goToPage(1);
   this.noPages=this.paginationService.noPages;
   this.paginationComplete=true;

   

 }
 //method for changing number of displayed results
 noResults(noPages){
   if (this.paginationComplete){
   this.paginationService.paginate(noPages);
   this.noPages=this.paginationService.noPages;
   this.actions=this.paginationService.goToPage(1);
  this.currentPage=1;
}
 }
 //gets start and end date from eventemmiter
 getStartDate(date){
   //console.log("admin gets start");
   this.startDate=date;
 }
 getEndDate(date){
   //console.log("admin gets end");
   this.endDate=date;
 }
 orderBy(prop:any, desc:boolean){
   this.initArray=new OrderByPropertyPipe().transform(this.initArray, prop, desc );

   this.paginationService.paginate(10, this.initArray );
   this.actions=this.paginationService.goToPage(1);
   this.noPages=this.paginationService.noPages;
   this.paginationComplete=true;
 }
  ngOnInit() {
    
  }

}
