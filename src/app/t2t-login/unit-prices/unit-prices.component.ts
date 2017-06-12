import 'angular-calendar/dist/css/angular-calendar.css';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ViewEncapsulation, Injectable, EventEmitter, Output, ElementRef, OnInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDayViewComponent,
  CalendarMonthViewComponent,
  CalendarDateFormatter
  
} from 'angular-calendar';
import { CustomDateFormatter } from '../custom-date-formatter.provider';
import {NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentParserFormatter } from '../../date-picker/ngb-datepicker-parser-formatter';
import { UnitsService} from '../units.service';
import { UnitsWizzardService} from '../units-wizzard.service';
import { Router, ActivatedRoute} from '@angular/router';

const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  hr: {
    weekdays: ['P', 'U', 'S', 'Č', 'P', 'S', 'N'],
    months: ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'],
  }
};

// Define a service holding the language. You probably already have one if your app is i18ned.
@Injectable()
export class I18n {
  language = 'hr';
}
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
_i18n: I18n=new I18n();
constructor(){
  super();
}
  getWeekdayName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getWeekdayShortName(weekday: number){
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthName(month: number): string {

    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number){
     return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthShortName(month: number){
     return I18N_VALUES[this._i18n.language].months[month - 1];
  }

}
@Component({
  selector: 'app-unit-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './unit-prices.component.html',
  styleUrls: ['./unit-prices.component.css'], encapsulation: ViewEncapsulation.None,
   providers: [
    I18n, 
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, 
    {provide: NgbDateParserFormatter, useFactory: () => { return new NgbDateMomentParserFormatter("D.M.Y") }},
    {
    provide: CalendarDateFormatter,
    useClass: CustomDateFormatter
  }

  ],
  host: {
    '(document:click)': 'onClick($event)',
  }, 
})
export class UnitPricesComponent implements OnInit{
/*

colors: 
  money green: rgb(  33,  108,   42)
  lightest:    rgb( 138,  219,  147)
 ranges:           +105, -111, -105

 */
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
activeCalendarIndex=-1;
  view: string = 'month';
  hoveredDate;
  public startDate:any;
  public endDate:any;
testDate:any;
months:any=  [
  {label:"Siječanj", value: 0},
  {label:"Veljača", value: 1},
  {label:"Ožujak", value: 2},
  {label:"Travanj", value: 3},
  {label:"Svibanj", value: 4},
  {label:"Lipanj", value: 5},
  {label:"Srpanj", value: 6},
  {label:"Kolovoz", value: 7},
  {label:"Rujan", value: 8},
  {label:"Listopad", value: 9},
  {label:"Studeni", value: 10},
  {label:"Prosinac", value: 11}
  ];

  unid:string;
oid:string;
newUrl:string;
periodsLoaded:boolean=false;

  years:any = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  selectedMonth:any={label:I18N_VALUES[this._i18n.language].months[new Date().getMonth()], value:new Date().getMonth()};
  selectedYear:any=new Date().getFullYear();


  viewDate: Date = new Date();
  locale:any='hr';
  weekStartsOn:number=1;

  modalData: {
    action: string,
    event: CalendarEvent
  };

  actions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
      this.handleEvent('Edited', event);
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.handleEvent('Deleted', event);
    }
  }];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [/*
    {
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: colors.red,
    actions: this.actions
  }, {
    start: startOfDay(new Date()),
    title: 'An event with no end date',
    color: colors.yellow,
    actions: this.actions
  }, {
    start: subDays(endOfMonth(new Date()), 3),
    end: addDays(endOfMonth(new Date()), 3),
    title: 'A long event that spans 2 months',
    color: colors.blue
  }, {
    start: addHours(startOfDay(new Date()), 2),
    end: new Date(),
    title: 'A draggable and resizable event',
    color: colors.yellow,
    actions: this.actions,
    resizable: {
      beforeStart: true,
      afterEnd: true
    },
    draggable: true
  }
  */];
  
periods:any[] = [];
dbPeriods:any={};
periodsSource:Subject<any>=new Subject();
periods$:any=this.periodsSource.asObservable();
  activeDayIsOpen: boolean = true;

  constructor( private modal: NgbModal, 
               private _i18n: I18n, 
               private _eref: ElementRef, 
               private us:UnitsService, 
               private uws:UnitsWizzardService, 
               private router:Router, 
               private route:ActivatedRoute,
               private ref: ChangeDetectorRef
) {
   // this.testDate=new Date(2017, 11, 20);
   // this.viewDate=this.testDate;
  // this.selectedMonth.value=I18N_VALUES[this._i18n.language].months[new Date().getMonth()];
  this.route.params.map( params => {

       console.log(params);
       this.uws.setUnid(params['unid']);
       this.unid=params['unid'];
       console.log();
       
      return this.us.getUnitPrices(this.unid).map(data=>{

                    this.periods.push('as');

                 console.log('db data:',data, typeof data, data?true:false, data['$value']==null, data.length, data[0+""]);

         if(data){
         this.periodsLoaded=false;
        Object.assign(this.dbPeriods, data);
        this.periods=[];
                  console.log(data.length, 0<data.length);

        for(let i=0;i<data.length; i++){
          console.log(data[i+""]);
          let start=new Date(data[i+""].start);
          let end=new Date(data[i+""].end);
          let startObj={year:start.getFullYear(), month:start.getMonth()+1, day:start.getDate()}
          let endObj={year:end.getFullYear(), month:end.getMonth()+1, day:end.getDate()};
                    console.log('START',start, startObj, 'END',end, endObj);

         // this.periodsSource.next({color:{red:56, green:183, blue:71}, price:period.price, startNgb:startObj, endNgb:endObj});
 //this.periods.push({color:{red:56, green:183, blue:71}, price:data[i+""].price, startNgb:startObj, endNgb:endObj});
 this.periods = this.periods.concat([{color:{red:56, green:183, blue:71}, price:data[i+""].price, startNgb:startObj, endNgb:endObj}]);
          this.starts(startObj, i+"");
          this.ends(endObj, i+"");
        }
        /*
        data.forEach((period, index) => {


        });*/
        this.calculateColors();
        console.log('PERIODS', this.periods);
      
    this.periodsLoaded=true;
        this.refresh.next();
        //this.periods=this.periods;
        this.ref.markForCheck();

         }
  }).subscribe();
      }).subscribe();
  
      this.oid=this.uws.oid;
}
ngOnInit(){
    this.router.events.subscribe(route => {
          let urlArray=route['url'].toString().split('/');
          
          let newArray=[];
          for(let i=0;i<=6;i++){
            newArray.push(urlArray[i]);
          }

          //urlArray[urlArray.length-1]='eq';
          this.newUrl=newArray.join('/');
          console.log(this.newUrl);
    });
}
 trackByIndex(index: number, value) {
    return index;
  }
set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    console.log('get',this._i18n.language);
    return this._i18n.language;
  }
  prevMonth(){
    if((this.selectedYear-1)>=2017 || (this.selectedMonth.value-1)>=0){
this.selectedYear=((this.selectedMonth.value-1)<0)?this.selectedYear-1:this.selectedYear;
this.selectedMonth=(this.selectedMonth.value-1)>=0?this.months[this.selectedMonth.value-1]:this.months[11];
    }else{
      this.viewDate=new Date(2017, 0);
    }
  }
  nextMonth(){
    if((this.selectedYear+1)<=2024 || (this.selectedMonth.value+1)<=11 ){
this.selectedYear=((this.selectedMonth.value+1)>11)?this.selectedYear+1:this.selectedYear;
this.selectedMonth=(this.selectedMonth.value+1)<=11?this.months[this.selectedMonth.value+1]:this.months[0];
    }else{
      this.viewDate=new Date(2024, 11);
    }


  }
  thisMonth(){
  this.selectedMonth={label:I18N_VALUES[this._i18n.language].months[new Date().getMonth()], value:new Date().getMonth()};
  this.selectedYear=new Date().getFullYear();
  }
onDateChange(){
 // console.log(this.selectedYear, this.selectedMonth.value)
if( this.selectedMonth.value){
  this.viewDate = new Date(this.selectedYear, this.selectedMonth.value);
}
}
  

isInside(date: NgbDateStruct){
  let index=this.activeCalendarIndex;
  if (index != -1 && this.periods[index].startNgb && this.periods[index].endNgb ){
  let startNgb=this.periods[index].startNgb;
  let endNgb=this.periods[index].endNgb;;

const d1=new Date(date.year, date.month - 1, date.day);
const start=new Date(startNgb.year, startNgb.month - 1, startNgb.day);
const end=new Date(endNgb.year, endNgb.month - 1, endNgb.day);
return (start!=null && end !=null)?d1 >= start && d1 <= end:false;
  }
  else{
    return false
  }
}
isInHoverRange(chkdate){
  let ckd=new Date(chkdate.year, chkdate.month - 1, chkdate.day);
  let date=this.hoveredDate;
  let index=this.activeCalendarIndex;

  if (index != -1 && date ){
      const d1=new Date(date.year, date.month - 1, date.day);
    if(this.periods[index].startNgb){
      let startNgb=this.periods[index].startNgb;
      const start=new Date(startNgb.year, startNgb.month - 1, startNgb.day);
      if((ckd >=d1 && d1<=start && ckd<=start) || (d1>start && d1>=ckd && ckd>=start)){
        return true;
      }

    } 

    if(this.periods[index].endNgb){
      let endNgb=this.periods[index].endNgb;
      const end=new Date(endNgb.year, endNgb.month - 1, endNgb.day);
      if((ckd<=d1 && d1>=end && ckd>=end)|| (d1<end && d1<=ckd && ckd<=end) ){
        return true;
      }

    }
  }

}
hover(date){
  this.hoveredDate=date;
}
isWeekend(date: NgbDateStruct) {
    const d1 = new Date(date.year, date.month - 1, date.day);
    return d1.getDay() === 0 || d1.getDay() === 6;
  }
  someDays(date: NgbDateStruct){
    const d1 = new Date(date.year, date.month - 1, date.day);
    
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
  }
  starts(value, index){
    //console.log("start");
    let ymdTodate=new Date(value.year, value.month-1, value.day);
    //console.log(ymdTodate.getTime());
   // console.log(ymdTodate);
    this.periods[index].start=(ymdTodate.getTime());
     this.periods[index].startDisplay=value.day+'.'+value.month+'.'+value.year;
     //this.periods[index].startNgb=value;
     this.activeCalendarIndex=-1;
    console.log(value, ymdTodate, ymdTodate.getTime());

  }
     ends(value, index){
       //console.log("end");
       //end date points to last millisecond of day
    let ymdTodate=new Date(value.year, value.month-1, value.day+1);
    //console.log(ymdTodate.getTime());
    //console.log(ymdTodate.getTime()-1);
      this.periods[index].end=(ymdTodate.getTime()-1);
      this.periods[index].endDisplay=value.day+'.'+value.month+'.'+value.year;
      //this.periods[index].endNgb=value;
this.activeCalendarIndex=-1;
console.log(value, ymdTodate, ymdTodate.getTime());

  }


  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    this.modal.open(this.modalContent, {size: 'lg'});
  }
addPeriod(){
  this.periods.push({color:{red:56, green:183, blue:71}});
  //this.periods.pop();
}

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
  
  /*
colors: 
  money green: rgb(  33,  108,   42)
  lightest:    rgb( 138,  219,  147)
 ranges:           +105, -111, -105

 */
  onClick(event) {
    if(this.activeCalendarIndex!=-1 && (event.path[0].className.indexOf('cal-start-'+this.activeCalendarIndex) == -1 && event.path[0].className.indexOf('cal-end-'+this.activeCalendarIndex) == -1)){
    let flag=false;
    //console.log(event);
    for(let i=0;i<event.path.length;i++){
      
      if(event.path[i].nodeName=="NGB-DATEPICKER"){
    //console.log("clicked inside", event.path[i].nodeName);
    flag=true;
    break;
  }
    }
if (flag==false){
  console.log('clicked-outside');
  if(this.periods.length>0 && this.activeCalendarIndex!=-1){
    if(this.periods[this.activeCalendarIndex] &&  this.periods[this.activeCalendarIndex].startDate && this.periods[this.activeCalendarIndex].startDate==true){
      console.log('closing start');
this.periods[this.activeCalendarIndex].startDate=false;
this.activeCalendarIndex=-1;}
  if(this.periods[this.activeCalendarIndex] && this.periods[this.activeCalendarIndex].endDate && this.periods[this.activeCalendarIndex].endDate==true){
    console.log('closing end');
this.periods[this.activeCalendarIndex].endDate=false;
this.activeCalendarIndex=-1;}
  
  }
  

}else{
  console.log('clicked-inside');
}
}
  }
checkPeriod(date){
  let x:any=false;
  let maxPrice:number=0;
  let maxIndex:number;
this.periods.forEach((period, index) =>{
  if (date.getTime() >= period.start && date.getTime() <=period.end){
   // console.log(date.getTime() >= period.start && date.getTime() <=period.end);
    if (period.price>maxPrice){
maxPrice=period.price;
maxIndex=index;
    }
   // maxPrice=period.price>maxPrice?period.price:maxPrice;

  }
});
    
if(maxPrice){
x={};
    x.price=maxPrice;
   x.color='rgb('+this.periods[maxIndex].color.red+', '+this.periods[maxIndex].color.green+', '+this.periods[maxIndex].color.blue+')';      }
return x;
}
calculateColors(){
  let maxPrice=0;
  let minPrice=99999;
  let colors=[];
  this.periods.forEach(period => {
if (period.price){
  maxPrice=period.price>maxPrice?period.price:maxPrice;
  minPrice=period.price<minPrice?period.price:minPrice;
}
  });
if (maxPrice!=minPrice){
let d=maxPrice-minPrice;

this.periods.forEach((period, index) => {
  if (period.price!=maxPrice){
    let r=(maxPrice-period.price)*1.01;
    period.color={
      red: Math.floor(56+(r/d)*112.0),
      green: Math.floor(183+(r/d)*(45.0)),
      blue: Math.floor(71+(r/d)*(104.0))
    }
    console.log('r:',r, 'd',d, 'r/d', ((r*1.01)/(d*1.01)) );
  }else{
    period.color={red:56, green:183, blue:71}; 
  }
});
}
}
onSubmit(){
  this.dbPeriods={};
  let i=0;
  this.periods.forEach(period => {
    if (period.start && period.end && period.price){
    this.dbPeriods[i]=(({ start, end, price }) => ({ start, end, price }))(period);
    i++;
    }
    
  });
  this.us.updateUnitPrices(this.unid, this.dbPeriods).then(
    () => {
      this.us.updateObject(this.oid, {ready:true}).then( ()=> {
        this.us.updateUnit(this.unid, {ready:true}).then(()=>{
          this.uws.setUnitState(this.unid, 'prices', 'completed');
          this.router.navigate([this.newUrl]);
        });}
      );
    }
  );;
  console.log(this.dbPeriods);
  
}

}
