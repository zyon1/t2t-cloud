import {Component, Injectable, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentParserFormatter } from '../../date-picker/ngb-datepicker-parser-formatter';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


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
  selector: 'app-up-reservation',
  templateUrl: './up-reservation.component.html',
  styleUrls: ['./up-reservation.component.css'],
  providers: [
    I18n, 
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, 
    {provide: NgbDateParserFormatter, useFactory: () => { return new NgbDateMomentParserFormatter("D.M.Y") }
    }] 
})
export class UpReservationComponent implements OnInit {
  public startDate:any;
  public endDate:any;
  constructor(private _i18n: I18n) { }
  set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    console.log('get',this._i18n.language);
    return this._i18n.language;
  }

  ngOnInit() {
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
    //this.start.emit(ymdTodate.getTime());
    //console.log(value);
  }
     ends(value){
       //console.log("end");
       //end date points to last millisecond of day
    let ymdTodate=new Date(value.year, value.month-1, value.day+1);
    //console.log(ymdTodate.getTime());
    //console.log(ymdTodate.getTime()-1);
    //this.end.emit(ymdTodate.getTime()-1);
    //console.log(value);
  }

}
