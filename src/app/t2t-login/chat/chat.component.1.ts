import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { DataService } from '../data.service';
import { GroupService } from '../group.service';

import { Message, GroupMessage } from '../message';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input('uid')uid:any;
  @Input('groups')groupsObs:any;
  users:any;
  groups:any;
  name:string;
  surname:string;
  constructor(private chatService:ChatService, private dataService:DataService, private groupService:GroupService) {
console.log(this.groups, this.uid);
   }

  ngOnInit() {

   // this.groupsObs.subscribe(console.log);
    this.groupsObs.subscribe(groups=>{
      // this.groups=groups;
      //console.log(groups, groups.length);
      let j=0;
      this.users=[];
      this.groups=[];
      groups.forEach(element => {
        let temp:any={$key:element};
        this.groupService.getGroupData(element).subscribe(gData=>{
          //console.log(gData);
          temp.groupName=gData.groupName;
          temp.groupType=gData.groupType;
        });
        this.chatService.getGroupChat(element).subscribe(msgs=>{
          temp.messages=msgs;
          temp.noMsg=10;

          //console.log("groups",this.groups);
          /* scroll to last msg */
            let objDiv = document.getElementById('content'+j);
          if (objDiv){objDiv.scrollTop = objDiv.scrollHeight;}
          
          }
        );
        //
        element=temp;
        //console.log(element); 
        this.groups.push(element);
        //console.log("groups",this.groups);
      });
      
    });
    this.dataService.getUserData().subscribe(user=>{
      this.name=user.name;
      this.surname=user.surname;
    });
this.chatService.getUserChat(this.uid).subscribe(msgs=>{
  let user:any={};
              msgs.forEach(element => {
                if (!element.recieved){
                
                this.chatService.setRecieved(this.uid, element.$key);
                console.log('primljeno svoje ili tuđe',msgs);
                if(element.senderID!=this.uid){
                  console.log('primljeno tuđe',msgs);
                  user.uid=element.senderID;
                  user.name=element.senderName;
                  user.surname=element.senderSurname;
                  user.new=true;
                  this.addUser(user, 2);

                  
                
              };  
                
                }
              });
              
              
              user.messages=msgs;
              user.noMsg=10;

          //console.log("groups",this.groups);
          /* scroll to last msg */


});
  }
  loadMore(gid:string, i){
         this.groups.forEach(element => {
           if (element.$key==gid){
         
           let objDiv = document.getElementById('content'+i);
           let scrHeight=objDiv.scrollHeight;
         element.noMsg+=10;
         this.chatService.getGroupChat(gid, element.noMsg).subscribe(msgs=>{
           element.messages=msgs;
           //console.log(element);
           objDiv.scrollTop = objDiv.scrollHeight;
         });
            }
         });
  }
  loadMoreUser(uid:string, i){
         this.groups.forEach(element => {
           if (element.$key==uid){
         
           let objDiv = document.getElementById('content'+i);
           let scrHeight=objDiv.scrollHeight;
         element.noMsg+=10;
         this.chatService.getUserChat(uid, element.noMsg).subscribe(msgs=>{
           element.messages=msgs;
           console.log(element);
           objDiv.scrollTop = objDiv.scrollHeight;
         });
            }
         });
  }

  addUser(user , j){
    let objDiv = document.getElementById('content'+j);
          if (objDiv){objDiv.scrollTop = objDiv.scrollHeight;}
            this.chatService.getUserChat(this.uid).subscribe(msgs=>{
              msgs.forEach(element => {
                if (!element.recieved){
                
                this.chatService.setRecieved(this.uid, element.$key);
                console.log('primljeno',msgs);
                if(element.senderID!=this.uid){user.new=true;};  
                
                }
              });
              
              
              user.messages=msgs;
              user.noMsg=10;

          //console.log("groups",this.groups);
          /* scroll to last msg */
            
          
          }
        );
    this.users.push(user);
  }
  
  openChat(gid, i){
    setTimeout(function(){ 
      let objDiv = document.getElementById('content'+i);
      if (objDiv){objDiv.scrollTop = objDiv.scrollHeight;}
     }, 0);
     
  }
  openUserChat(uid, i){
    setTimeout(function(){ 
      let objDiv = document.getElementById('content'+i);
      if (objDiv){objDiv.scrollTop = objDiv.scrollHeight;}
     }, 0);
     
  }
  sendMessage(gid, message, i){
    console.log(gid, message);
    let tmpMsg=new GroupMessage(this.uid, this.name, this.surname, message);
    this.chatService.sendGroupMessage(gid, tmpMsg);

  }
  sendUserMessage(uid, message, i){

     // constructor(senderID, senderName, senderSurname, text, seen?, timestamp?)
    let tmpMsg=new Message(this.uid, this.name, this.surname, message);
        console.log(tmpMsg);

    this.chatService.sendPrivateMessage(this.uid, tmpMsg);
    this.chatService.sendPrivateMessage(uid, tmpMsg);
  }

}
