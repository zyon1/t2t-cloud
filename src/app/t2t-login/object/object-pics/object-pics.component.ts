import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject, Observer } from 'rxjs';
import { ModalWindowComponent } from '../../../modal-window/modal-window.component';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//declare var firebase: any;
interface Image {
    path: string;
    filename: string;
    downloadURL?: string;
    $key?: string;
}
@Component({
  selector: 'app-object-pics',
  templateUrl: './object-pics.component.html',
  styleUrls: ['./object-pics.component.css']
 
})
export class ObjectPicsComponent implements OnInit {
   @ViewChild('filesElement') filesElement:ElementRef;
oid:any;   
uid:any;
contentIn:any;
bundleResolutions:any[]=[1500, 1200, 800, 200, 100, 50];
currentConflict:any;
modalContent={title:'Upozorenje!',
text:'',
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

conCounter=0;
maxConnections:number=8;
uploadDelay:number=0;
finishUpload:boolean=true;
conflicts:any[]=[];
showModal=false;
constructor( private route: ActivatedRoute, private router: Router, private ng2ImgMaxService: Ng2ImgMaxService, private db: AngularFireDatabase, private dragulaService: DragulaService) {
this.dragulaService.dragend.map(x=>{return this.uploaded}).subscribe(
  result => {   
    let counter=0;
    let picsObj={};
    result.forEach(
      element => {
        let newObj=Object.assign({}, element.pic);
        element.pic=newObj;
        picsObj[counter]=element;
        counter++;
      }
    );
    console.log(picsObj);
  });  
}

  ngOnInit() {
    let initial=false;
    this.route.parent.params.subscribe( params => {
      this.oid=params['oid'];
      this.uid=params['id'];
      this.db.list(`objectPics/${this.oid}`).subscribe(pics => {
        if (!initial)
          {  
            this.picCount=pics.length;
            initial=true;
          };
          //console.log(pics);
        pics.forEach(pic => {
          let key;
          if (pic.resolution1500 && pic.resolution100){
            let path=`/${this.oid}/100/100-${pic.filename}`;
            let fbStorageRef= firebase.storage().ref(path);
                          let index = this.uploaded.findIndex(x=>{return x.pic.filename==pic.filename});
              if (index != -1){
                if(this.uploaded[index].uploading){
                  this.uploaded[index]={pic:pic, loading:true};
                  key=index;
                }                   
              }else{
                console.log(pic['$key']);
                key=pic['$key'];
                this.uploaded.push({pic:pic, loading:true});
                //this.uploaded[pic['$key']]={src:result, pic:pic, loaded:true};
              }
            fbStorageRef.getDownloadURL().then(result => {
              if (this.uploaded[key]){
                this.uploaded[key].src=result;
                this.uploaded[key].loaded=true;
                this.uploaded[key].loading=null;
                this.uploaded[key].uploading=null;
              }
            });
          }
        });

      });
    });
  }
  serializeUpload(){
    this.uploadActive=true;
    let item, upItem;
    let storageRef = firebase.storage().ref();
console.log('upload started');
 let upld=()=>{
   if(item=this.upArray.shift()){
   let path = item.newName?`/${this.oid}/${item.prefix}/${item.prefix}-${item.newName}`:`/${this.oid}/${item.prefix}/${item.prefix}-${item.image.name}`;
   let iRef = storageRef.child(path);
console.log(item);
   let nextId=item.oldIndex?item.oldIndex:this.picCount+item.imageId;
   
   if (upItem!=nextId){
     this.uploaded[nextId].resizing=null;

   this.uploaded[nextId].uploading=true;
   }
   upItem=nextId;
   console.log(nextId);

      
return Observable.from(iRef.put(item.image)).subscribe((snapshot) => {
     this.db.object(`objectPics/${this.oid}/${nextId}`).update(
       {
         ['resolution'+item.prefix]: true,
         filename: item.newName?item.newName:item.image.name, //clear name
         timestamp: firebase.database['ServerValue']['TIMESTAMP'],
         uploadedBy: this.uid
        }).then(
               x=>{
return upld();
               });        
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
        let referencePath = `${this.oid}/images/` + image.$key;
        // Do these as two separate steps so you can still try delete ref if file no longer exists
        // Delete from Storage
        firebase.storage().ref().child(storagePath).delete()
        .then(
            () => {},
            (error) => console.error("Error deleting stored file",storagePath)
        );
        // Delete references
        this.db.object(`objectPics/${this.oid}/`).remove()
    }
bundler(fileIndex, resolutionIndex,  files){
  let firstFile=true;
  let firstBundle=true;
  let recBundler=(i, j, file)=>{
    //console.log(i, j, fileIndex);
    return this.ng2ImgMaxService.resizeImage(file, this.bundleResolutions[j], this.bundleResolutions[j]).map(
      result => {
        this.itemSize+=result.size;
        if(files[i].newName){
          this.upArray.push({image:result, prefix:this.bundleResolutions[j], imageId:i, newName:files[i].newName});
        }else{
          this.upArray.push({image:result, prefix:this.bundleResolutions[j], imageId:i});
          if(files[i].oldIndex){this.upArray[this.upArray.length-1].oldIndex=files[i].oldIndex;
          console.log('file have old index:', files[i].oldIndex);}
        }
        if (j<this.bundleResolutions.length-1){
        //same file next resolution
          return recBundler(i,j+1, result).subscribe(); 
        }else{
          if (i>=files.length){
          // all files bundled 
          }else{
          //bundle next file
            this.itemStart=Date.now();
            this.cumuSize+=this.itemSize;
            this.itemSize=0;
            if(files[i].skip!=true){ //if file doesnt need to be overwritten
              this.uploaded.push({pic:{filename:files[i].newName?files[i].newName:files[i].name}, resizing:true, index:this.picCount+i}); //interface file have read-only property filename, so new property newName is introduced
            }
            console.log('End: ', (Date.now()-this.start)/1000, 'Duration:', (Date.now()-this.itemStart)/1000, 'Bundle size:', this.itemSize, 'Total size:', this.cumuSize, 'index:'+i );
            if(!this.uploadActive){
              console.log('activiting upload');
              this.serializeUpload();
            } 
            if(firstBundle){
              firstBundle=false;
            }
            firstFile=false;
            return recBundler(i+1,0, files[i+1]).subscribe(); //go to next file
          }
        }
      });
    }
    recBundler(fileIndex, resolutionIndex, files[0]).subscribe();
 }
 selected(imageResult: any) {
   this.tempFiles=[];
     // this.uploadActive=true;
    // console.log(imageResult.target.files["0"].name);
if (this.uploaded.length==0){ // if no files are uploaded yet        
  this.bundler(0, 0, imageResult.target.files);}
else{
for(let i=0;i<imageResult.target.files.length;i++){
      // console.log(imageResult.target.files[i].name, this.uploaded);

for (let j=0;j<this.uploaded.length;j++){
      
      
  //console.log(this.uploaded[j], imageResult.target.files[i].name);
  if (this.uploaded[j].pic.filename==imageResult.target.files[i].name){
    this.openModal.push(true);
    let tmpContent=this.modalContent;
    tmpContent.text=`
    <div class="alert alert-danger">
    <p>
    <i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i> Postoji datoteka s imenom: ${imageResult.target.files[i].name}! Molimo, odaberite jednu od ponuđenik akcija:
    </p>
    <ul>
      <li><strong>Zadrži obje</strong> Na kraju imena nove slike će se dodati idući slobodni redni broj u zagradama. Npr.: Slika1.jpg će biti preimenovana u Slika1(1).jpg.</li>
      <li><strong>Zadrži novu</strong> Nova slika će prebrisati staru.</li>
      <li><strong>Zadrži staru</strong> Neće biti promjena.</li>
    </ul>
   </div> 
    `;
    
    this.conflicts.push({source:j, target:i, content:tmpContent}); // source : uploaded files, target: file being uploaded
    console.log('found',this.conflicts);

    break;
  }
  //console.log(i==imageResult.target.files.length-1 && j==this.uploaded.length -1 && this.conflicts.length==0);
  if(i==imageResult.target.files.length-1 && j==this.uploaded.length -1 && this.conflicts.length==0){ //if no conflicts
  this.bundler(0, 0, imageResult.target.files);

      console.log('last');
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
  strArr[strArr.length -2 ]+='('+fileNameCounter+')';
  let nameSuggestion=strArr.join(".");
  while (this.uploaded.findIndex(element =>{return element.pic.filename == nameSuggestion })!=-1){
    console.log(this.uploaded.findIndex(element =>{return element.pic.filename == nameSuggestion }));
  fileNameCounter++;
  strArr=this.tempFiles[conflict.target].name.split(".");
  strArr[strArr.length -2 ]+='('+fileNameCounter+')';
  nameSuggestion=strArr.join(".");
  
  //console.log(nameSuggestion);

  }
    this.tempFiles[conflict.target].newName=strArr.join(".");
  console.log(strArr.join("."), this.tempFiles[conflict.target]);
  break;
  case 'old':
    this.tempFiles.splice( conflict.target, 1 );
  break;
  case 'new':
  this.tempFiles[conflict.target].skip=true;
  this.tempFiles[conflict.target].oldIndex=conflict.source;
  console.log(this.tempFiles[conflict.target]);
  this.uploaded[conflict.target.source]={pic:{filename:this.uploaded[index].pic.filename}, resizing:true};
  break;
}
 this.conflicts.splice(index, 1);
  if(this.conflicts.length==0){
    console.log('conflicts resolved', this.tempFiles);
    if (this.tempFiles.length>0){
      this.bundler(0, 0, this.tempFiles);

    }
this.tempFiles=[];      
  }
  console.log(this.conflicts);
  }
}
