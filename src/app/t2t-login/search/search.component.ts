import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GroupService } from '../group.service';
import { LoginService } from '../login.service';
import { DataService } from '../data.service';
import { WatchingService } from '../watching.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  @Output() onAddUser = new EventEmitter<any>();
  users:any;
  groups:any;
  searchText:any='';
  userResults:any;
  groupResults:any;
  areResults:boolean;
  usersEmitted:boolean;
  users$:any;
  groups$:any;
  canSearch:boolean=false;
  allFlags:any;
  constructor(private dataService: DataService, private loginService:LoginService, private groupService:GroupService, private ws: WatchingService ) { 
    this.allFlags=[false,false]
    this.users$=this.dataService.getAllUserData();
    this.groups$=this.groupService.getAllGroupData();
    this.users$.subscribe(users=>{
      this.users=users;
      this.allFlags[0]=true;
      if (this.allFlags[0]==true && this.allFlags[1]==true){this.canSearch=true;}
    });
    this.groups$.subscribe(groups=>{
      this.groups=groups;
      this.allFlags[1]=true;
      if (this.allFlags[0]==true && this.allFlags[1]==true){this.canSearch=true;}
      });
    //this.groupService.searchAllGroups('Neprimarna grupa').subscribe(src=>console.log('New search results', src));
    
  }
  ngOnInit() {
  }
   addUser(user) {
    this.onAddUser.emit(user);
  }
  activateSearch(){
  }
  search(text){
    //console.log(text);
    if (this.users || this.groups){
    this.areResults=false;
    let regExp=new RegExp(text, 'i');//'/'+text+'/i';
    this.searchText=text;
    this.userResults=[];
    this.groupResults=[];
    
    
    if (text!=""){
      console.log(text);
                  //this.groupService.searchAllGroups(text).subscribe(src=>console.log('New search results', src));
                   this.users.forEach(element => {
                     if (element.email.search(regExp) > -1 || (element.name+" "+element.surname).search(regExp) > -1){
                        this.userResults.push({email:element.email, uid:element.$key, name:element.name, surname:element.surname });
                        this.areResults=true;
                     }
                   });
    
       this.groups.forEach(element => {
         
        if (element.groupName.search(regExp) > -1){
          this.groupResults.push(element);
          console.log(element);
          this.areResults=true;
        }
     });
    }else{
      this.areResults=false;
    }
    
  }
  }
}
