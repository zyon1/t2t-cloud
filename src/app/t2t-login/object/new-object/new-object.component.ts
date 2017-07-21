import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../../group.service';
import { LoginService } from '../../login.service';
import { UnitsService } from '../../units.service';
import { MapsAPILoader } from '@agm/core';
import { CustomSelectComponent } from '../../custom-select/custom-select.component';
import { StandardPickerComponent } from '../../standard-picker/standard-picker.component';
import { LocationPickerComponent } from '../../location-picker/location-picker.component';
import { UnitsWizzardService } from '../../units-wizzard.service';
import { NgZone } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
  
} from '@angular/forms';
import { T2tValidatorDirective } from '../../t2t-validator.directive';

declare var google: any;

interface tObject { // * - obavezno polje, @ - automatski se popunjava
    name?: string, //*
    autonomus?: boolean, //*
    standard?: number, //*
    location?: { //*
      street?: string,
      streetNr?: string,
      place?: string,
      postcode?: any,
      country?: string,
      lat?: number,
      lng?: number    
    }
    type?: any, // private:(1:app/rooms/studio, 2:villa, 3:kuća za odmor, 4: robinson, 5: agro, 6:kamena kuća), hoteli, hosteli, pansion, ostalo - *
    subType: any,
    created?: number, // @
    active?: boolean, // @
    createdBy?: string,//uid @
    ready?: boolean // ako nije minimalan broj podataka popunjen onda je false  - @ ako sve * nisu pune onda je false       
    }

@Component({
  selector: 'app-new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
//stars:number=0;
//selectedStars:number=0;
//objectSelected:number=-1;
//objectSubtype:number=-1;
//title: string = 'My first angular2-google-maps project';
lat: number = 44.11934019145355;
lng: number = 15.231364799999938;
oid: string;
uid: string;
gid: string;
//styles: any = ['hybrid', 'roadmap', 'satellite', 'terrain'];
zoom: number = 12;
objectTypes=['Privatni smještaj', 'Hotel', 'Hostel', 'Pansion', 'Ostalo'];
objectSubTypes=['Apartman, soba studio', 'Villa', 'Kuća za odmor', 'Robinzonski smještaj', 'Agro turizam', 'Kamena kuća'];
//streetName:string;
//streetNr:string;
/*autocompleteData:any={
  street_number: '', // broj
        route: '', //ulica
        locality: '', //grad
        administrative_area_level_1: '', //zupanija
        country: '', // drzava 
        postal_code: '',
        streetFull: ''
};*/
//name:string;
//autonomus: any;

tObj: tObject={
  name: '',
  autonomus: false,
  standard: 0, 
  location: { //*
      street: '',
      streetNr: '',
      place: '',
      postcode: '',
      country: '',

  },
  type: -1,
  subType: -1
};
//loc:any;
//locFound:boolean=false;
submitted:boolean=false;
//typeTouched:boolean=false;
//subtypeTouched:boolean=false;
//beforeSubmit:boolean=false;
//customSelect=-1;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private loginService: LoginService,
    private us: UnitsService,
    private uws:UnitsWizzardService,
    private _loader: MapsAPILoader,
    private _zone: NgZone,
    ) { 

  }
  ngOnInit() {
      this.route.parent.parent.params.subscribe(params =>this.uid=params['id']);
        this.route.parent.params.subscribe( params => {
      //console.log(params['oid']);  
      this.oid=params['oid'];
      
      this.gid=params['gid'];
      console.log(this.oid, this.uid, this.gid);
      this.us.getTObject(params['oid']).subscribe(
        x=>{
          Object.assign(this.tObj, x)
          console.log(this.tObj);
        });
      });

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
  this.tObj.location.street='';
  this.tObj.location.streetNr='';
  this.lat=place.geometry.location.lat();
this.tObj.location.lat=this.lat;
console.log(this.lat);
//this.locFound=true;
    this.lng=place.geometry.location.lng();
    this.tObj.location.lng=this.lng;
    this.zoom=16;

                 //clear results
              this.tObj.location.street='';
              this.tObj.location.place='';
              this.tObj.location.country='';
              this.tObj.location.postcode='';
              //populate form
                  for (var i = 0; i < place.address_components.length; i++) {
                  let isAdrFull=false;

                 let   autocompleteData2:any={
  street_number: '', // broj
        route: '', //ulica
        locality: '', //grad
        administrative_area_level_1: '', //zupanija
        country: '', // drzava 
        postal_code: '',
        streetFull: ''
};
          let addressType = place.address_components[i].types[0];
          if (place.address_components[i][componentForm[addressType]]) {
              

            switch (addressType){
              case 'street_number':
              this.tObj.location.streetNr=place.address_components[i][componentForm[addressType]];
              break;
              case 'route':
              this.tObj.location.street=place.address_components[i][componentForm[addressType]];
              
              break;
              case 'locality':
              this.tObj.location.place=place.address_components[i][componentForm[addressType]];
              break;
              case 'country':
              this.tObj.location.country=place.address_components[i][componentForm[addressType]];
              break;
              case 'postal_code':
              this.tObj.location.postcode=place.address_components[i][componentForm[addressType]];
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
            //      console.log(this.streetNr=='');



}

               });

  

                
            });
        });
  }  	
  updateMarkerLocation(event){
   // console.log(event);
    this.lat=event.coords.lat;
    this.lng=event.coords.lng;
  }
  validator(control: FormControl): {[key:string]: boolean} {
  if (!control.value.match(/^pee/)) {
    return { 'badName': true };
  }
}
  onSubmit(data) {
   //let state={osnovno:{completed: true}, sadrzaji: {available:true}};
   event.preventDefault();
    this.uws.setObjectState(this.oid, 'osnovno', 'sadrzaji');
    this.submitted = true;
    console.log(this.oid);
    this.us.updateObject(this.oid, data)
      .then( 
        r=>{
          console.log('updated', this.uid, this.gid, this.oid);
          
         this.router.navigate(['auth/user/'+this.uid+'/group/'+this.gid+'/units/object/'+this.oid+'/data']);

        })
      .catch(
        r=>{
          console.error('Update failed:', r);
        });
    console.log('submitted');


  }
/*
  save(){
    let x: tObject={
  name: '',
  autonomus: false,
  standard: 0, 
  location: { //*
      street: '',
      place: '',
      postcode: '',
      country: '',

  },
  type: null,
  subType: null
};

    console.log('tObject',this.tObj);



  }*/
}