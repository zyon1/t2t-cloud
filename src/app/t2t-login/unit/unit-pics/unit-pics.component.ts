import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, TemplateRef, Directive } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject, Observer } from 'rxjs';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ModalWindowComponent } from '../../../modal-window/modal-window.component';
import * as firebase from 'firebase';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { UnitsWizzardService} from '../../units-wizzard.service';
import { UnitsService} from '../../units.service';

//declare var firebase: any;
interface Image {
    path: string;
    filename: string;
    downloadURL?: string;
    $key?: string;
}
             
@Component({
  selector: 'app-unit-pics',
  templateUrl: './unit-pics.component.html',
  styleUrls: ['./unit-pics.component.css'],
  
 
})
export class UnitPicsComponent implements OnInit {
   @ViewChild('filesElement') filesElement:ElementRef;
   @ViewChild('modalText')template: TemplateRef<any>;
oid:any;   
uid:any;
unid:any;
gid:any;
contentIn:any;
bundleResolutions:any[]=[1500, 1200, 800, 200, 100, 50];
currentConflict:any;
modalContent={title:'Upozorenje!',
buttons:[{action: 'both', text:'Zadrži obje'}, {action:'new', text: 'Zadrži novu'}, {action:'old', text: 'Zadrži staru'}]
};
openModal:boolean[]=[];
modalOptions={
  backdrop:true,
  dispose:false,
  closeButton:false
};
tempFiles:any[]=[];
skipFiles:any[]=[];
//bundle$:Observable<any>;
private bundleSource:Subject<any>=new Subject();
bundle$:Observable<any>=this.bundleSource.asObservable();
//resizeObserver:any;
  closeResult: string;
start:any;
itemStart:any;
cumuSize:any=0;
itemSize:any=0;
uploaded:any[]=[];
uploadCounter:any=0;
activeConSource:Subject<any>=new Subject();
activeCon$:Observable<any>=this.activeConSource.asObservable();
//uploadObserver:any;
picCount:number=0;
upArray:any[]=[];
uploadActive:boolean=false;
//activeConnections:any;
picsArray:any;
conCounter=0;
maxConnections:number=8;
uploadDelay:number=0;
finishUpload:boolean=true;
conflicts:any[]=[];
showModal=false;
constructor( 
    private route: ActivatedRoute, 
    private router: Router, 
    private ng2ImgMaxService: Ng2ImgMaxService, 
    private db: AngularFireDatabase, 
    private dragulaService: DragulaService, 
    private sanitizer:DomSanitizer,
    private uws:UnitsWizzardService,
        private us:UnitsService  
      
) {

this.dragulaService.dragend.map(x=>{return this.uploaded}).subscribe(
  result => {   
        this.picsArray=[];

    let counter=0;
    let picsObj={};
    result.forEach(
      element => {
        let newObj=Object.assign({}, element.pic);
        element.pic=newObj;
        picsObj[counter]=element;
        counter++;
        newObj.src=null;
        newObj.state=null;
        newObj.pic=null;
        console.log(newObj);
        this.picsArray.push(newObj);
      }
    );
    console.log(picsObj);
  });  
}

  ngOnInit() {
    let initial=false;
    this.route.parent.parent.parent.params.subscribe(params=>{
            this.oid=params['oid'];
this.uid=params['id'];
this.gid=params['gid'];
    });
    this.route.parent.params.subscribe( params => {
      //console.log(params);
      this.unid=params['unid'];
             this.uws.setUnid(params['unid']);

      this.db.list(`unitPics/${this.unid}`).delay(50).subscribe(pics => {
                this.picsArray=Object.assign({}, pics);

        //console.log('new database information about files');
        if (!initial)
          {  
            //this.picCount=pics.length;
            initial=true;
          };
          //console.log(pics);
        //  let key=0;
        pics.forEach((pic, key) => {
          
          console.log(pic);
          if (pic.success){
            let path=`/${this.unid}/100/100-${pic.filename}`;
            let fbStorageRef= firebase.storage().ref(path);
            let index = this.uploaded.findIndex(x=>{return x.pic.filename==pic.filename});
            //console.log(index);
              if (index != -1){
                if(this.uploaded[index].state=="uploading"){
                  //console.log('loading... picture with index',index);
//                        console.log('index', index, 'from:', this.uploaded[index].state, '=>to loading');

                  if(this.uploaded[index].state!='loading'){

                    this.uploaded[index]={pic:pic, state:'loading'};
                  }
                  //key=index;
                }                   
              }else{
  //              console.log('adding next index', pic['$key'], 'new-state: loading');
//                key=pic['$key'];

                this.uploaded.push({pic:pic, state:"loading"});
                                this.picCount++;

                //this.uploaded[pic['$key']]={src:result, pic:pic, loaded:true};
              }
              
            fbStorageRef.getDownloadURL().then(result => {
     console.log('new result', key);
                                        //  console.log('index', key, 'from:', this.uploaded[key].state, '=>to loaded');

              if (this.uploaded[key]){
     console.log('new result', key);
                this.uploaded[key].src=this.sanitizer.bypassSecurityTrustStyle('url('+result+')');
;
                                     console.log('index', key, 'from:', this.uploaded[key].state, '=>to loaded', this.sanitizer.bypassSecurityTrustStyle('url('+result+')'));

                if(this.uploaded[key].state!='loaded'){

                  this.uploaded[key].state='loaded';}
                              
              }
           // key++;
          }).catch(
              err=>{
                console.log(err);
                if(this.uploaded[key].state!='error'){

                  this.uploaded[key].state='error';}
                             // key++;
              
              }
            );
          }

        });
      });
    });
  }
  serializeUpload(){
    this.uploadActive=true;
    let item, upItem, flag, filename;
    flag=0;
    let arr={
      
    };
    let storageRef = firebase.storage().ref();
//console.log('upload started');
 let upld=()=>{
  // console.log('upld fn called');
   if(item=this.upArray.shift()){
    // console.log(item);
    let name=item.newName?item.newName:item.image.name;
    if(typeof arr[name]=='undefined')arr[name]={};
    if(typeof arr[name].resolution=='undefined'){arr[name]['resolution']=[];}
    arr[name].resolution.push(item.prefix);//[1500, 1200, 800, 200, 100, 50]
//console.log(this.bundleResolutions.every(elem => arr[name].resolution.indexOf(elem) > -1),arr); // ako su sve rezolucije uploadane
//arr[name].resolution();
   let path = `/${this.unid}/${item.prefix}/${item.prefix}-${name}`;
   let iRef = storageRef.child(path);
//console.log('is piccount ok?', item.imageId, this.picCount);
   let nextId=item.oldIndex || item.oldIndex==0?item.oldIndex:this.picCount+item.imageId;
   //console.log('__index itema(nama ako postoji)', item.imageID, 'iduci',nextId, 'stari',item.oldIndex);
   if (upItem==nextId){
    //    console.log(upItem, nextId);
   //console.log(upItem, nextId, this.uploaded);

   console.log('index', nextId, 'from:', this.uploaded[nextId].state, '=>to uploading', 'oldIndex', item.oldIndex, item.imageId);
   if(this.uploaded[nextId].state!='uploading'){
         


     this.uploaded[nextId].state='uploading';}
   //console.log(this.uploaded);
   }
   upItem=nextId;

     // console.log(item.image);
return Observable.from(iRef.put(item.image)).subscribe((snapshot) => {
  //console.log('uploading item to fbstorage');
  console.log(this.bundleResolutions.every(elem => arr[name].resolution.indexOf(elem) > -1));
  if (this.bundleResolutions.every(elem => arr[name].resolution.indexOf(elem) > -1)){
    this.db.object(`unitPics/${this.unid}/${nextId}`).update(
       {
         ['resolution'+item.prefix]: true,
         success: true,
         filename: item.newName?item.newName:item.image.name, //clear name
         timestamp: firebase.database['ServerValue']['TIMESTAMP'],
         uploadedBy: this.uid
        }).then(
               x=>{
//console.log('file data updated');
return upld();
               }); 
  }else{
    this.db.object(`unitPics/${this.unid}/${nextId}`).update(
       {
         ['resolution'+item.prefix]: true,
         success:false,
         filename: item.newName?item.newName:item.image.name, //clear name
         timestamp: firebase.database['ServerValue']['TIMESTAMP'],
         uploadedBy: this.uid
        }).then(
               x=>{
//console.log('file data updated');
return upld();
               });  
  }
             
   }); 

   }else{
     console.log('upload.complete');
     this.uploadActive=false;
   }
 }
upld();
}

    delete(image: Image) {
        let storagePath = image.path;
        let referencePath = `${this.unid}/images/` + image.$key;
        // Do these as two separate steps so you can still try delete ref if file no longer exists
        // Delete from Storage
        firebase.storage().ref().child(storagePath).delete()
        .then(
            () => {},
            (error) => console.error("Error deleting stored file",storagePath)
        );
        // Delete references
        this.db.object(`unitPics/${this.unid}/`).remove()
    }
bundler(fileIndex, resolutionIndex,  files){

  let skipCount=0;
  console.log(files);
  let recBundler=(i, j, file)=>{
    console.log(i, j);
    if(i!=0){//previous file exists
        if (files[i-1].oldIndex || files[i-1].oldIndex==0){//previous file have old index
          if(this.uploaded[files[i-1].oldIndex].state!='waiting'){
          this.uploaded[files[i-1].oldIndex].state='waiting';
          this.uploaded[files[i-1].oldIndex].src='';
        }
          
      }else{ //preovious file doenst have old index
        if(i-skipCount==this.picCount-1){
let newInd=i-skipCount+this.picCount-1;
if(this.uploaded[newInd].state!='waiting'){
          this.uploaded[newInd].state='waiting';
          this.uploaded[newInd].src='';
        }
        }
        }
      }


    if(j==0 && (files[i].oldIndex || files[i].oldIndex==0) ){
      if(this.uploaded[files[i].oldIndex].state!='resizing'){
          this.uploaded[files[i].oldIndex].state='resizing';
          this.uploaded[files[i].oldIndex].src='';}
      skipCount++;
      
console.log('updatingSkip',skipCount, files[i].oldIndex);} 
    return this.ng2ImgMaxService.resizeImage(file, this.bundleResolutions[j], this.bundleResolutions[j]).map(
      result => {
        this.itemSize+=result.size;
        
        if((files[i].oldIndex || files[i].oldIndex==0)){ //if file have old index
          //console.log('file have old index');
        
          this.upArray.push({image:result, prefix:this.bundleResolutions[j], imageId:i-skipCount, oldIndex: files[i].oldIndex});
          
          
          //this.upArray[this.upArray.length-1].oldIndex=files[i].oldIndex;
          /*
          if (this.bundleResolutions[j]==this.bundleResolutions[this.bundleResolutions.length-1]){
            if(this.uploaded[files[i].oldIndex].state!='waiting'){
              this.uploaded[files[i].oldIndex].state='waiting';
            }
          }
          */
         }else{
           if (files[i].newName){
//console.log('file have new name but doesnt have old index');
          this.upArray.push({image:result, prefix:this.bundleResolutions[j], imageId:i-skipCount, newName: files[i].newName});

           }else{
  //           console.log('file doesnt have new name nor old index');
             this.upArray.push({image:result, prefix:this.bundleResolutions[j], imageId:i-skipCount});


           }
           /*
           if (this.bundleResolutions[j]==this.bundleResolutions[this.bundleResolutions.length-1]){
             if(this.uploaded[this.picCount+i-skipCount].state!='waiting'){
               this.uploaded[this.picCount+i-skipCount].state='waiting';
             }
           }
           */
         }


         if (!this.uploaded[this.picCount+i-skipCount]){
                    console.log('pushing file on location', this.picCount+i-skipCount );

this.uploaded.push({pic:{filename:files[i].newName?files[i].newName:files[i].name}, state:'resizing', index:this.picCount+i-skipCount}); //interface file have read-only property filename, so new property newName is introduced
            //  console.log(this.picCount+i-skipCount-1);
}




        //console.log(j<this.bundleResolutions.length-1);
        if (j<this.bundleResolutions.length-1){
        //same file next resolution
        //console.log('same file next resolution');
          return recBundler(i,j+1, result).subscribe(); 
        }else{
          if (i>=files.length){
          // all files bundled 
          console.log('all files are bundled');
        }else{
console.log('bundling last file');
          //bundle next file
         // console.log(Date.now());
            this.itemStart=Date.now();
            this.cumuSize+=this.itemSize;
            this.itemSize=0;
            
            if(files[i].skip!=true){ //if file doesnt need to be overwritten
             
            //console.log('==>upl pic index:',i,'piccount:',this.picCount,'skip:',skipCount, 'total',this.picCount+i-skipCount);
              
              //firstAdded=false;
            }else{
              
              //console.log(files);
              //this.uploaded.[]({pic:{filename:files[i].newName?files[i].newName:files[i].name}, resizing:true, index:this.picCount+i});
            }
            //console.log(this.uploadActive);
           // console.log('End: ', (Date.now()-this.start)/1000, 'Duration:', (Date.now()-this.itemStart)/1000, 'Bundle size:', this.itemSize, 'Total size:', this.cumuSize, 'index:'+i );
            if(!this.uploadActive){
              console.log('activiting upload');
              this.serializeUpload();
            } 

//console.log('next file, bundler', i+1, 'prevFileIndex', i+skipCount+this.picCount);

            return recBundler(i+1,0, files[i+1]).subscribe(); //go to next file
          }
        }
      });
    }
    recBundler(fileIndex, resolutionIndex, files[0]).subscribe();
 }
 selected(imageResult: any) {
   this.tempFiles=[];
    
if (this.uploaded.length==0){ // if no files are uploaded yet    
  console.log('no files are uploaded yet, calling bundler');    
  this.bundler(0, 0, imageResult.target.files);}
else{
for(let i=0;i<imageResult.target.files.length;i++){
      // console.log(imageResult.target.files[i].name, this.uploaded);

for (let j=0;j<this.uploaded.length;j++){
      
      
  //console.log(this.uploaded[j], imageResult.target.files[i].name);
  if (this.uploaded[j].pic.filename==imageResult.target.files[i].name){
    //console.log(this.uploaded[j].pic.filename);
    this.openModal.push(true);
    this.conflicts.push({source:j, target:i, filename:this.uploaded[j].pic.filename}); // source : uploaded files, target: file being uploaded
    console.log('found',this.conflicts);

    break;
  }
  //console.log(i==imageResult.target.files.length-1 && j==this.uploaded.length -1 && this.conflicts.length==0);
  if(i==imageResult.target.files.length-1 && j==this.uploaded.length -1 && this.conflicts.length==0){ //if no conflicts
    console.log('no conflicts, calling bundler');
  this.bundler(0, 0, imageResult.target.files);

    //  console.log('last');
    }
 // console.log(j);
}}
}

  //console.log(this.conflicts);
  this.picCount=this.uploaded.length;


  this.itemStart=Date.now();
  this.start=Date.now();
  console.log('Start: ', (Date.now()-this.start)/1000);
}
filenameConflicts(action, conflict, index){

  console.log(action, conflict, this.currentConflict);
  if (this.tempFiles.length==0){ // populate temp file with files from input so we can filter them
    for (let i=0;i<this.filesElement.nativeElement.files.length;i++){
this.tempFiles.push(this.filesElement.nativeElement.files[i]);
    }
  }

switch(action){
  case 'both':

  let fileNameCounter=1;
  let strArr=this.tempFiles[conflict.target].name.split(".");
  strArr[strArr.length -2 ]+='-'+fileNameCounter;
  //strArr[strArr.length -2 ]+='('+fileNameCounter+')';
  let nameSuggestion=strArr.join(".");
  while (this.uploaded.findIndex(element =>{return element.pic.filename == nameSuggestion })!=-1){
    //console.log(this.uploaded.findIndex(element =>{return element.pic.filename == nameSuggestion }));
  fileNameCounter++;
  strArr=this.tempFiles[conflict.target].name.split(".");
  strArr[strArr.length -2 ]+='-'+fileNameCounter;
  //strArr[strArr.length -2 ]+='('+fileNameCounter+')';
  nameSuggestion=strArr.join(".");
  
  //console.log(nameSuggestion);

  }
    this.tempFiles[conflict.target].newName=strArr.join(".");
  //console.log(strArr.join("."), this.tempFiles[conflict.target]);
  break;
  case 'old':
    this.tempFiles.splice( conflict.target, 1 );
  break;
  case 'new':
  this.tempFiles[conflict.target].skip=true;

  this.tempFiles[conflict.target].oldIndex=conflict.source;
  //console.log(this.tempFiles[conflict.target]);
      console.log('index', conflict.source, 'from:', this.uploaded[conflict.source].state, '=>to resizing');
/*
  if(this.uploaded[conflict.source].state!="resizing"){
    this.uploaded[conflict.source].state="resizing";
  }
  //this.uploaded[conflict.source].resizing=true;//={pic:{filename:this.uploaded[index].pic.filename}, resizing:true};
  this.uploaded[conflict.source].src='';*/
  //this.picCount--;
  break;
}
 this.conflicts.splice(index, 1);
  if(this.conflicts.length==0){
    console.log('conflicts resolved', this.tempFiles);
    if (this.tempFiles.length>0){
      console.log('conflicts.resolved, calling bundler', this.tempFiles);
      this.bundler(0, 0, this.tempFiles);

    }
this.tempFiles=[];      
  }
  //console.log(this.conflicts);
}
onSubmit(data) {
   event.preventDefault();
   this.us.updateUnitPics(this.unid, data).then(r => {
     this.uws.setUnitState(this.unid, 'slike', 'prices').then(re=>{
                this.router.navigate(['auth/user/'+this.uid+'/group/'+this.gid+'/units/object/'+this.oid+'/units/'+this.unid+'/prices']);         

     });
 });
 }
}
