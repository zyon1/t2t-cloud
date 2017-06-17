import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DbCorrectionService } from '../db-correction.service';
import { Router, ActivatedRoute} from '@angular/router';
import { UnitsService} from '../units.service';
import { LoginService} from '../login.service';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { NgZone } from '@angular/core';
import * as firebase from 'firebase';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

declare var google: any;
const noop = () => {
  console.log('asdf');
};
@Component({
  selector: 'app-unit-preview',
  templateUrl: './unit-preview.component.html',
  styleUrls: ['./unit-preview.component.css'],
   encapsulation: ViewEncapsulation.None,
   providers: [NgbCarouselConfig]
   
})
export class UnitPreviewComponent implements OnInit {
uid:string;
unid:string;
oid:string;
unitData:any;
objectData:any;
standardArray:any;
lat: number;
lng: number;
styles: any = ['hybrid', 'roadmap', 'satellite', 'terrain'];
zoom: number = 13;
capacity:any={main:0, extra:0};
unitPics:any=[];
objectPics:any=[];
unitGalleryActive:boolean=false;
objectGalleryActive:boolean=false;
activeID:number=0;
activeIDObject:number=0;
reservationContainerOpen=true;
  constructor(
      private router:Router, 
      private route:ActivatedRoute, 
      private us:UnitsService, 
      private ls:LoginService, 
      private _loader: MapsAPILoader, 
      private _zone: NgZone,
      private sanitizer:DomSanitizer,
      private carouselConfig: NgbCarouselConfig) {
       
  
        carouselConfig.wrap = true;
    carouselConfig.keyboard = true;
    carouselConfig.interval=0;
    this.ls.uid$.flatMap(uid => {
      console.log(uid);
      this.uid=uid;
      return this.route.params.flatMap(params => {
      console.log(params);
      this.unid=params['unid'];
      return this.us.getFullUnidData(this.unid).flatMap(unit =>{
    this.unitData=unit;
     this.capacity={main:0, extra:0};
     this.capacity.main=unit.unitRooms.noSingleBeds?unit.unitRooms.noSingleBeds:0;
     this.capacity.main+=unit.unitRooms.noQueenBeds?unit.unitRooms.noQueenBeds*2:0;
     this.capacity.main+=unit.unitRooms.noKingBeds?unit.unitRooms.noKingBeds*2:0;
     this.capacity.extra=unit.unitRooms.extraSingleBeds?unit.unitRooms.extraSingleBeds:0;
     this.capacity.extra+=unit.unitRooms.extraDoubleBeds?unit.unitRooms.extraDoubleBeds*2:0;
     this.capacity.extra+=unit.unitRooms.extraLRSingleBeds?unit.unitRooms.extraLRSingleBeds:0;
     this.capacity.extra+=unit.unitRooms.extraLRDoubleBeds?unit.unitRooms.extraLRDoubleBeds*2:0;
         this.unitPics=[];

     unit.unitPics.forEach((pic, index) => {
       if (pic.success){
         let tmpPic:any={};
         tmpPic.path100=`/${this.unid}/100/100-${pic.filename}`;
         tmpPic.path200=`/${this.unid}/200/200-${pic.filename}`;
         tmpPic.path1500=`/${this.unid}/1500/1500-${pic.filename}`;
         let fbStorageRef100= firebase.storage().ref( tmpPic.path100);
         let fbStorageRef200= firebase.storage().ref( tmpPic.path200);
         let fbStorageRef1500= firebase.storage().ref( tmpPic.path1500);
         tmpPic.filename=pic.filename;
         tmpPic.loaded=false;
         this.unitPics.push(tmpPic);
         fbStorageRef100.getDownloadURL().then(result100 => {
           fbStorageRef200.getDownloadURL().then(result200 => {
           fbStorageRef1500.getDownloadURL().then(result1500 => {
             //console.log( "url('"+result100+"')");
           this.unitPics[index].src100=this.sanitizer.bypassSecurityTrustStyle("url('"+result100+"')");;
           this.unitPics[index].src200=this.sanitizer.bypassSecurityTrustStyle("url('"+result200+"')");
           this.unitPics[index].src1500=this.sanitizer.bypassSecurityTrustStyle("url('"+result1500+"')");
           //console.log(this.unitPics);
         });
         });
         });





       }
     });
      this.oid=unit.oid['$value'];
      return this.us.getFullObject(unit.oid['$value']); 
    });
    
    });
  }).subscribe(objectData => {
    this.objectData=objectData;
    this.objectPics=[];
      objectData.objectPics.forEach((pic, index) => {
       // console.log(pic);
       if (pic.success){
         let tmpPic:any={};
         tmpPic.path100=`/${this.oid}/100/100-${pic.filename}`;
         tmpPic.path200=`/${this.oid}/200/200-${pic.filename}`;
         tmpPic.path1500=`/${this.oid}/1500/1500-${pic.filename}`;
         let fbStorageRef100= firebase.storage().ref( tmpPic.path100);
         let fbStorageRef200= firebase.storage().ref( tmpPic.path200);
         let fbStorageRef1500= firebase.storage().ref( tmpPic.path1500);
         tmpPic.filename=pic.filename;
         tmpPic.loaded=false;
         this.objectPics.push(tmpPic);
         fbStorageRef100.getDownloadURL().then(result100 => {
           fbStorageRef200.getDownloadURL().then(result200 => {
           fbStorageRef1500.getDownloadURL().then(result1500 => {
             //console.log( "url('"+result100+"')");
           this.objectPics[index].src100=this.sanitizer.bypassSecurityTrustStyle("url('"+result100+"')");;
           this.objectPics[index].src200=this.sanitizer.bypassSecurityTrustStyle("url('"+result200+"')");
           this.objectPics[index].src1500=this.sanitizer.bypassSecurityTrustStyle("url('"+result1500+"')");
           //console.log(this.objectPics);
         });
         });
         });





       }
     });
    this.standardArray = Array(objectData.objectBasic.standard).map((x, i)=>i);

   // console.log(this.unitData, this.objectData);
  });
    
    
   }

  ngOnInit() {

  }

}
