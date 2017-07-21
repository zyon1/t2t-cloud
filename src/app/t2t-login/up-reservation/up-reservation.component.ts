import {Component, Injectable, OnInit} from '@angular/core';
import {NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentParserFormatter } from '../../date-picker/ngb-datepicker-parser-formatter';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ReservationService } from '../reservation.service';
import { UnitsService } from '../units.service';
import { WatchingService } from '../watching.service';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';

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
interface Note {
  date:any;
  text:string;

}
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
  noGuests:number=1;
  expandGuestData:boolean=false;
  guestDetails:boolean=false;
  notes:any=[];
  noteObject:Note={
    date:'',
    text:''
  };
  unid:string;
  unitName:string;
  uid:string;
  //guestData:any;
  guestData:any={
    name:'',
    middlename:'',
    surname:'',
    tel:'',
    email:'',
    documentType:-1,
    idNumber:'',
    place:'',
    country:'',
    birthCountry:'',
    birthPlace:''

  };
  reservation:any;
  reservationPrices:any=[];
  reservationFetched:any=false;
reservations:any;
  constructor(private _i18n: I18n, private rs:ReservationService, private ls:LoginService, private route:ActivatedRoute, private us:UnitsService, private ws:WatchingService) {
    this.ls.uid$.flatMap(uid => {
      this.uid=uid;
 return this.route.params;
    }).subscribe(params => {
      this.unid=params['unid'];
      this.us.getUnitBasic(this.unid).map(data => {
this.unitName=data.name;
      }).subscribe();
      this.rs.fetchUnitReservations(this.unid).subscribe(reservations => {
        console.log("RESERVATIONS FETCHED", reservations);
        this.reservations=reservations;
        this.reservationFetched=true;
    });
      console.log(this.unid, this.uid);
    })
   }
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
  checkAvailability(date: NgbDateStruct){
  let x:any=false;
  if (this.reservationFetched){
  let dateJS=new Date(date.year, date.month - 1, date.day);
  // CORRECTION: new Date(`${date.year}-${date.month }-${date.day}T01:00:00+02:00`); //treba provjeriti da li je vako kako treba definiran datum
  console.log(dateJS, this.reservations);
    this.reservations.forEach(reservation => {
      //resFetchObj[reservation.$key]={};
     // console.log(reservation, new Date(reservation.from), new Date(reservation.to))
//console.log(reservation.from <= date.getTime(),  reservation.to>=date.getTime(), new Date(reservation.from), date, new Date(reservation.to));
//console.log(dateJS.getTime() >= reservation.from   && dateJS.getTime() <=reservation.to, dateJS.getTime() >= reservation.from , dateJS.getTime() <=reservation.to)
if (dateJS.getTime() >= reservation.from   && dateJS.getTime() <reservation.to){
//console.log( date);
//x=true;
x=true;

}
    
  });
  
    

  
}
console.log(x);
return x;
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
  addNote(noteObject){
    let tmpDate=new Date(noteObject.date.year, noteObject.date.month-1, noteObject.date.day);
    noteObject.date=tmpDate.getTime();
    console.log(noteObject.date);
    this.notes.push(noteObject);
    this.noteObject={
    date:'',
    text:''
  };
}
findReservationPrices(){
  if (this.startDate && this.endDate){
  let reservation:any={};
  reservation.from=new Date(this.startDate.year, this.startDate.month-1, this.startDate.day).getTime();
  reservation.to=new Date(this.endDate.year, this.endDate.month-1, this.endDate.day).getTime();
  reservation.unid=this.unid;
  this.us.getUnitPrices(this.unid).map(periods => {
let maxPrice:number;
  let maxIndex:number;
  reservation.prices=[];
  console.log('fetching prices')
  for(let date=reservation.from;date<reservation.to;date=date+1000*60*60*24){ //1000 milisecons * 60 seconds * 60 minutes * 24hours
    maxPrice=0;
periods.forEach((period, index) =>{
  if (date >= period.start &&  date <=period.end){
   // console.log(date.getTime() >= period.start && date.getTime() <=period.end);
    if (period.price>maxPrice){
maxPrice=period.price;
maxIndex=index;
    }
    if (maxPrice){
      reservation.prices.push({date:new Date(date), price:maxPrice});
      //console.log(new Date(date), maxPrice);
    }
   // maxPrice=period.price>maxPrice?period.price:maxPrice;

  }
});
  }
this.reservationPrices=reservation.prices;

}).subscribe();
}
}
makeReservation(guestData){
  // TODO: napraviti validaciju rezervacije

  let reservation:any={};
  reservation.from=new Date(this.startDate.year, this.startDate.month-1, this.startDate.day).getTime();
  reservation.to=new Date(this.endDate.year, this.endDate.month-1, this.endDate.day).getTime();
  reservation.unid=this.unid;
  reservation.uid=this.uid;
  reservation.noGuests=this.noGuests;

this.us.getUnitPrices(this.unid).map(periods => {
let maxPrice:number;
  let maxIndex:number;
  reservation.prices=[];
  console.log('fetching prices')
  for(let date=reservation.from;date<reservation.to;date=date+1000*60*60*24){ //1000 milisecons * 60 seconds * 60 minutes * 24hours
    maxPrice=0;
periods.forEach((period, index) =>{
  if (date >= period.start &&  date <=period.end){
   // console.log(date.getTime() >= period.start && date.getTime() <=period.end);
    if (period.price>maxPrice){
maxPrice=period.price;
maxIndex=index;
    }
    if (maxPrice){
      reservation.prices.push(maxPrice);
      console.log(new Date(date), maxPrice);
    }
   // maxPrice=period.price>maxPrice?period.price:maxPrice;

  }
});
  }


  this.rs.makeReservation(reservation, guestData, this.notes).then(_=>{

        let tempData={type:2, active:true, delivered:false, solved:false, data:{unid:this.unid, unitName:this.unitName}};
        console.log(this.uid, tempData)
    this.ws.setWatcher(this.uid, tempData);
  });
}).subscribe();


  console.log(guestData, this.notes, reservation)
}

}
