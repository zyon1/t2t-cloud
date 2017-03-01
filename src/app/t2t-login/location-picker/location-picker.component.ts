import { Component, OnInit, Input, forwardRef, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { NgZone } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';


declare var google: any;
const noop = () => {
  console.log('asdf');
};

interface location{
  street?:string;
  streetNr?:string;
  place?:string;
  postCode?:string;
  country?:string;
  lat?:number;
  lng?:number;
  locErr?:string

}
export function createValidator() {
  return function validate(c: FormControl) {
     //return null;
   let error:location={};
    let isErr:boolean=false;
    console.log(c.value, isErr, error);
if (c.value){
       if(c.value.street=='' ){
         error.street="Nedostaje ime ulice.";
         
         isErr=true;
        }
       if(c.value.streetNr==''){
         error.streetNr="Nedostaje kućni broj.";
         isErr=true;
        }
       if(c.value.place==''){
         error.place="Nedostaje ime mjesta.";
         isErr=true;
        }
       if(c.value.postCode==''){
         error.postCode="Nedostaje poštanski broj.";
         isErr=true;
        }
       if(c.value.country==''){
         error.country="Nedostaje ime države.";
         isErr=true;}
       if(typeof c.value.lat == 'undefined' || typeof c.value.lng == 'undefined'){
         error.locErr="Neispravna lokacija.";
         isErr=true;
      }
   
}
    return isErr ? error: null;
    
  }
 
}

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css'],
   providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationPickerComponent),
      multi: true
    },
     { 
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LocationPickerComponent),
      multi: true
    }]
})
export class LocationPickerComponent implements  OnInit, ControlValueAccessor  {
@Input('searchStr') searchStr:any;
lat: number = 44.11934019145355;
lng: number = 15.231364799999938;
styles: any = ['hybrid', 'roadmap', 'satellite', 'terrain'];
zoom: number = 13;
locFound:boolean=false;
disabled:boolean=false;
autocompleteData:any={
  street_number: '', // broj
        route: '', //ulica
        locality: '', //grad
        administrative_area_level_1: '', //zupanija
        country: '', // drzava 
        postal_code: '',
        streetFull: ''
};

location: location={
  street:'',
  streetNr:'',
  place:'',
  postCode:'',
  country:''
};


constructor(private _loader: MapsAPILoader, private _zone: NgZone) { 

  console.log();
}
loaded:boolean=false;
 validateFn:Function;
private onTouchedCallback: () => void = noop;
private onChangeCallback: (_: any) => void = noop;

  ngOnInit() {
    
    this.validateFn = createValidator();



let componentForm = {
        street_number: 'short_name', // broj
        route: 'long_name', //ulica
        locality: 'long_name', //grad
        administrative_area_level_1: 'short_name', //zupanija
        country: 'long_name', // drzava 
        postal_code: 'short_name' // zipcode
      };

        this._loader.load().then(() => {
         
            let autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
           //console.log(google.maps.MapTypeId.SATELLITE);
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
               this._zone.run(() => {
                 console.log("search");


//fetch result data
                 let place = autocomplete.getPlace();

// change center of the map/marker location
if (place && place.geometry && place.geometry.location){
  this.lat=place.geometry.location.lat();
  this.location.lat=this.lat;
  this.locFound=true;
  this.lng=place.geometry.location.lng();
  this.location.lng=this.lng;
  this.zoom=16;
                 //clear results
              this.location.street='';
              this.location.streetNr='';
              this.location.place='';
              this.location.country='';
              this.location.postCode='';
              //populate form
                  for (var i = 0; i < place.address_components.length; i++) {
/*
                  let isAdrFull=false;

                 let   autocompleteData2:any={
  street_number: '', // broj
        route: '', //ulica
        locality: '', //grad
        administrative_area_level_1: '', //zupanija
        country: '', // drzava 
        postal_code: '',
        streetFull: ''
};*/
          let addressType = place.address_components[i].types[0];
          if (place.address_components[i][componentForm[addressType]]) {
              

            switch (addressType){
              case 'street_number':
              this.location.streetNr=place.address_components[i][componentForm[addressType]];
              break;
              case 'route':
              this.location.street=place.address_components[i][componentForm[addressType]];
              break;
              case 'locality':
              this.location.place=place.address_components[i][componentForm[addressType]];
              break;
              case 'country':
              this.location.country=place.address_components[i][componentForm[addressType]];
              break;
              case 'postal_code':
              this.location.postCode=place.address_components[i][componentForm[addressType]];
              break;

            }
           // let val = place.address_components[i][componentForm[addressType]];
           /*
         if (this.streetName!='' && this.streetNr!='' && !isAdrFull){
           isAdrFull=true;
          this.tObj.location.street=(this.streetName + ' ' + this.streetNr);
    }*/



          }
        }
        this.select(this.location);
        




}

               });

  

                
            });
        });


  }
  
  ngOnChanges(changes) {
    
      this.validateFn = createValidator();
    
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

   writeValue(value: any) {
      if (value !== undefined) {
this.select(value);

       
      }
  }

 
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }

  


setDisabledState(isDisabled: boolean){
  this.disabled=isDisabled;
}
/* get selectedValue() {
    return this.selected;
  }

  set selectedValue(val) {
    this.selected = val;
    this.propagateChange(this.selected);
  }
*/
updateMarkerLocation(event){
   // console.log(event);
    this.lat=event.coords.lat;
    this.lng=event.coords.lng;
    this.location.lat=event.coords.lat;
    this.location.lng=event.coords.lng;
  }
   select(value){
     console.log(value);
     console.log(this.location);
     if (value) {this.location=value}
     //if(value && !this.loaded){this.location=value;this.loaded=true;}
     if(value && value.lat && value.lng){
       this.locFound=true;
       this.lat=value.lat;
       this.lng=value.lng;
    }
    this.propagateChange(value);
 
  }
}
