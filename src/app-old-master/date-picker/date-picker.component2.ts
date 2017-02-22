import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core';
import {NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentParserFormatter } from './ngb-datepicker-parser-formatter';

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

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
_i18n: I18n=new I18n();
constructor(){
  super();
}
  

  getWeekdayName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthName(month: number): string {

    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
}

// Define a service holding the language. You probably already have one if your app is i18ned.


@Component({
  selector: 'app-dual-date-popup',
  templateUrl: './dual-date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    I18n, 
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, 
    {provide: NgbDateParserFormatter, useFactory: () => { return new NgbDateMomentParserFormatter("D.M.Y") }
    }] 
})
export class DualDatePickerComponent {
  
  public startDate:any;
  public endDate:any;
  @Output() start = new EventEmitter();
  @Output() end = new EventEmitter();
 constructor(private _i18n: I18n) {
  }

  set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    console.log('get',this._i18n.language);
    return this._i18n.language;
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
  starts(value){
    //console.log("start");
    let ymdTodate=new Date(value.year, value.month-1, value.day);
    //console.log(ymdTodate.getTime());
    //console.log(ymdTodate);
    this.start.emit(ymdTodate.getTime());
    //console.log(value);
  }
     ends(value){
       //console.log("end");
       //end date points to last millisecond of day
    let ymdTodate=new Date(value.year, value.month-1, value.day+1);
    //console.log(ymdTodate.getTime());
    //console.log(ymdTodate.getTime()-1);
    this.end.emit(ymdTodate.getTime()-1);
    //console.log(value);
  }
}














/*import { Component } from '@angular/core';
import * as moment from 'moment';
 
// webpack html imports
 
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {
  public startDT:Date = new Date();
  public endDT:Date=new Date();
  public start:any;
  public end:any;
  public minDate:Date = void 0;
  public events:Array<any>;
  public tomorrow:Date;
  public afterTomorrow:Date;
  public startPopup:boolean=false;
  public endPopup:boolean=false;

  public formats:Array<string> = ['d.M.y','DD-MM-YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];
  public format:string = this.formats[0];
  public dateOptions:any = {
    formatYear: 'YY',
    startingDay: 1
  };
  private opened:boolean = true;
 
  public constructor() {
    (this.tomorrow = new Date()).setDate(this.tomorrow.getDate() + 1);
    (this.afterTomorrow = new Date()).setDate(this.tomorrow.getDate() + 2);
    (this.minDate = new Date()).setDate(this.minDate.getDate() - 1000);
    this.events = [
      {date: this.tomorrow, status: 'full'},
      {date: this.afterTomorrow, status: 'partially'}
    ];
  }
 
  public getStartDate():number {
    return this.startDT && this.startDT.getTime() || new Date().getTime();
  }
 public getEndDate():number {
    return this.endDT && this.endDT.getTime() || new Date().getTime();
  }
  public todayStart():void {
    this.startDT = new Date();
  }
   public todayEnd():void {
    this.endDT = new Date();
  }
 
  public setStartDate(date:any):void {
    console.log(date);
    this.startDT = moment(date, 'D.M.y').toDate();
    console.log(moment(date, 'D.M.y'));
    console.log(this.startDT);

  }
   public setEndDate(date:any):void {
    this.endDT = moment(date, 'd.M.y').toDate();
  }
 
  // todo: implement custom class cases
  public getDayClass(date:any, mode:string):string {
    if (mode === 'day') {
      let dayToCheck = new Date(date).setHours(0, 0, 0, 0);
 
      for (let i = 0; i < this.events.length; i++) {
        let currentDay = new Date(this.events[i].date).setHours(0, 0, 0, 0);
 
        if (dayToCheck === currentDay) {
          return this.events[i].status;
        }
      }
    }
 
    return '';
  }
 
  public disabled(date:Date, mode:string):boolean {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  }
 
  public open():void {
    this.opened = !this.opened;
  }
 
  public clearStart():void {
    this.startDT = void 0;
  }
  public clearEnd():void {
    this.endDT = void 0;
  }
 
  public toggleMin():void {
    this.startDT = new Date(this.minDate.valueOf());
  }
}
*/