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
import { Observable } from 'rxjs/Observable';

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
import { ReservationService} from '../reservation.service';

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
  selector: 'app-availability-alpha',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './availability-alpha.component.html',
  styleUrls: ['./availability-alpha.component.css'],
  encapsulation: ViewEncapsulation.None,
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
export class AvailabilityAlphaComponent implements OnInit {

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
units$:any;
newUrl:string;
periodsLoaded:boolean=false;
minStayPeriod:any;
pricePeriod:any;
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
reservations$:Observable<any[]>;
reservationFetched:any={};
guests:any={};
editCalendar=false;
overrides$:any;
overrides:any;
price:any;
minStay:any;
  constructor( private modal: NgbModal, 
               private _i18n: I18n, 
               private _eref: ElementRef, 
               private us:UnitsService, 
               private router:Router, 
               private route:ActivatedRoute,
               private ref: ChangeDetectorRef,
               private rs: ReservationService
) {
   // this.testDate=new Date(2017, 11, 20);
   // this.viewDate=this.testDate;
  // this.selectedMonth.value=I18N_VALUES[this._i18n.language].months[new Date().getMonth()];
  this.route.params.subscribe( params => {

       console.log(params);
       this.oid=params['oid'];
       
                   this.units$=this.us.getObjectUnits(this.oid).map(units => {
                     let tmpArr=[];
                     units.forEach(unit => {
                        console.log(unit);

                       tmpArr.push(
                         {
                           unid:unit['$key'], 
                           //ready$:this.us.getUnit(unit['$key']).map(unit => {return unit.ready}), 
                           name$: this.us.getUnitBasic(unit['$key']).map(unit => {return unit.name})});
                     });
                     return tmpArr;
                   })

  });
}
ngOnInit(){
  /*
    this.router.events.subscribe(route => {
          let urlArray=route['url'].toString().split('/');
          
          let newArray=[];
          for(let i=0;i<=6;i++){
            newArray.push(urlArray[i]);
          }

          //urlArray[urlArray.length-1]='eq';
          this.newUrl=newArray.join('/');
          console.log(this.newUrl);
    });*/
}
fetchData(unid){
  this.reservations$= this.rs.fetchUnitReservations(unid);
  this.overrides$=this.us.getOverridesMulti(unid).flatMap(overrides => {
    this.overrides=overrides;
    return this.us.getClosed(unid).map(closedDates => {
      closedDates.forEach(closedDate => {
        console.log(closedDate);
        if (this.overrides[closedDate['$key']]){
        this.overrides[closedDate['$key']].closed=true;}else
        {
          this.overrides[closedDate['$key']]={closed:true}
        }
      });
      //Object.assign(this.overrides, closedDates);
      //console.log(this.overrides);
    this.ref.markForCheck();

    })
  });
  this.overrides$.subscribe();
  this.periods$=this.us.getUnitPrices(this.unid).map(data=>{


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
 this.periods = this.periods.concat([{color:{red:56, green:183, blue:71}, price:data[i+""].price, startNgb:startObj, endNgb:endObj, minStay:data[i+""].minStay}]);
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

}
existingReservations(date):Observable<any>{
  let x:any=false;
  let tmpObj:any={$key:false};
  let resFetchObj:any={};
  /** 
   * $key:{
   * start:false,
   * end: false }
  */
  return this.reservations$.map(reservations => {
    reservations.forEach(reservation => {
      //resFetchObj[reservation.$key]={};
      let firstReservation=true;
      if (typeof this.reservationFetched[reservation.$key]=="undefined"){
        this.reservationFetched={[reservation.$key]:{}};
        this.reservationFetched[reservation.$key].start=false;
        this.reservationFetched[reservation.$key].end=false;
      }
      if (!this.reservationFetched[reservation.$key].start || !this.reservationFetched[reservation.$key].end){
     // console.log(reservation, new Date(reservation.from), new Date(reservation.to))
//console.log(reservation.from <= date.getTime(),  reservation.to>=date.getTime(), new Date(reservation.from), date, new Date(reservation.to));
if (date.getTime() >= reservation.from   && date.getTime() <=reservation.to){
//console.log( date);
//x=true;

if(date.getTime()==reservation.from){
  this.reservationFetched[reservation.$key].start=true;
  tmpObj.start=true;
  
  this.rs.fetchReservationData(reservation.$key).flatMap(res => {
    //console.log(res);
    return this.rs.fetchGuestData(res.guid).map(gData => 
    { this.ref.markForCheck();
      return gData.name + " " +gData.surname});
  }).subscribe(gdName=>{
    this.guests[reservation.$key]=gdName;

  });
  tmpObj.$key=reservation.$key;

}
if(date.getTime()==reservation.to){
  this.reservationFetched[reservation.$key].end=true;
  tmpObj.end=true;
  tmpObj.end$key=reservation.$key;
}else{
  tmpObj.$key=reservation.$key;

}
x=true;
}
firstReservation=false;
    }
  });
  if (x==false){tmpObj=false};
    //console.log(tmpObj);

    return tmpObj;

  });
  
}
fetchOverrides(date){
  let tmpDate=date.getTime();
  if (this.overrides[tmpDate]){
    return this.overrides[tmpDate];
  }else{
    return false;
  }
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
checkOverrides(date){

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
    x.minStay=this.periods[maxIndex].minStay;
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
closeDate(date){
  this.us.setClosed(this.unid, date.getTime());
}
closeDateRange(){
  let tmpStart=new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day).getTime();
  //new Date(`${start.year}-${start.month}-${start.day}`);
  let  tmpEnd=new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day).getTime();
    this.us.setClosedMulti(this.unid, tmpStart, tmpEnd);
  
}
clearOverridesRange(){
    let tmpStart=new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day).getTime();
  //new Date(`${start.year}-${start.month}-${start.day}`);
  let  tmpEnd=new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day).getTime();
  this.us.updateOverridesMulti(this.unid, tmpStart, tmpEnd, null).then(_=>{this.us.setOpenedMulti(this.unid, tmpStart, tmpEnd)});
}
setOverridesRange(){
  let tmpStart=new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day).getTime();
  //new Date(`${start.year}-${start.month}-${start.day}`);
  let  tmpEnd=new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day).getTime();
  this.us.updateOverridesMulti(this.unid, tmpStart, tmpEnd, {price:this.price?this.price:null, minStay:this.minStay?this.minStay:null})
}
openDate(date){
  this.us.setOpened(this.unid, date.getTime());
}
clearOverrides(date){
  this.us.setOpened(this.unid, date.getTime()).then(_=>{
    this.us.updateOverrides(this.unid, {[date.getTime()]:null});
  });
  
}
overrideMinStay(minStay, date){
  let tmpDate=date.getTime();
  let tmpObj={[tmpDate]:{minStay:minStay}};
  this.us.updateOverrides(this.unid, tmpObj);
}
overridePrice(price, date){
  let tmpDate=date.getTime();
  let tmpObj={[tmpDate]:{price:price}};
  this.us.updateOverrides(this.unid, tmpObj);
}
onSubmit(){
  
}

}
