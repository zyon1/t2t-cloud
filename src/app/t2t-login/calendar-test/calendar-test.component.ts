import 'angular-calendar/dist/css/angular-calendar.css';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ViewEncapsulation, Injectable, EventEmitter, Output, ElementRef} from '@angular/core';
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
  CalendarMonthViewComponent
  
} from 'angular-calendar';
import {NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentParserFormatter } from '../../date-picker/ngb-datepicker-parser-formatter';

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
  selector: 'app-calendar-test',
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-test.component.html',
  styleUrls: ['./calendar-test.component.css'],
  encapsulation: ViewEncapsulation.None,
   providers: [
    I18n, 
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, 
    {provide: NgbDateParserFormatter, useFactory: () => { return new NgbDateMomentParserFormatter("D.M.Y") }
  }],
  host: {
    '(document:click)': 'onClick($event)',
  }, 
})
export class CalendarTestComponent {
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



  viewDate: Date = new Date();

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

  events: CalendarEvent[] = [{
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
  }];
periods:any[] = [];
  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private _i18n: I18n, private _eref: ElementRef) {}
set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    console.log('get',this._i18n.language);
    return this._i18n.language;
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
    console.log(ymdTodate);
    this.periods[index].start=(ymdTodate.getTime());
     this.periods[index].startDisplay=value.day+'.'+value.month+'.'+value.year;
     this.periods[index].startNgb=value;
     this.activeCalendarIndex=-1;
    console.log(value);

  }
     ends(value, index){
       //console.log("end");
       //end date points to last millisecond of day
    let ymdTodate=new Date(value.year, value.month-1, value.day+1);
    //console.log(ymdTodate.getTime());
    //console.log(ymdTodate.getTime()-1);
      this.periods[index].end=(ymdTodate.getTime()-1);
      this.periods[index].endDisplay=value.day+'.'+value.month+'.'+value.year;
      this.periods[index].endNgb=value;
this.activeCalendarIndex=-1;
    //console.log(value);
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
this.periods.forEach(period =>{
  if (date.getTime() >= period.start && date.getTime() <=period.end){
   // console.log(date.getTime() >= period.start && date.getTime() <=period.end);
    x={};
    x.price=period.price;
    x.color='rgb('+period.color.red+', '+period.color.green+', '+period.color.blue+')';
  }
})  
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


}
