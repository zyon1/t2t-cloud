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
  /*@Input('uid')uid:any;*/
  /*
  @Input('groups')groupsObs:any;*/
  uid:string;
  groupChats:any=[];
  chats:any[];
  users:any=[];
  groups:any=[];
  name:string;
  surname:string;
  constructor(private chatService:ChatService, private dataService:DataService, private groupService:GroupService){
//console.log(this.groups, this.uid);
   // this.chatService.restructureBase();
   }
  ngOnInit() {
      this.dataService.getLoggedUserData().subscribe(userData=>{
      this.name=userData.name;
      this.surname=userData.surname;
      this.uid=userData.$key;
      //console.log(userData);
    })
    this.groupService.getMyGroupsMembers().subscribe(
        groups =>{
        //console.log(groups);
        let j=0;
        this.groupChats=[];
        groups.forEach(group=>{
          let tmpGroup:any={};
          this.groupService.getGroupData(group.$key).flatMap(gData=>{
          tmpGroup.$key=group.$key;
            return this.chatService.getGroupChat(group.$key).map(msgs=>{
              tmpGroup.groupName=gData.groupName;
              tmpGroup.groupType=gData.groupType;
              tmpGroup.messages=msgs;
              tmpGroup.noMsg=10;
              return tmpGroup;
            });
          }).subscribe(groupFull => {
            this.groupChats.push(groupFull);
            console.log(this.groupChats);
            //console.log(groupFull, this.groups);
        });
        j++;
        });
      }
    );
    this.chatService.getLastChats().subscribe(users => {
      //console.log("ALOOOOO");
      this.chats=[];
      users.forEach(user =>{
        //console.log(user);
        let tmpUser:any={};
          tmpUser.$key=user.$value;

        this.dataService.getUserDataWithEmail(user.$value).subscribe(data => {
          tmpUser.name=data.name;
          tmpUser.surname=data.surname;
          tmpUser.email=data.email;
          //console.log('BBBBBBBBBBB',this.chats,  this.chats[this.chats.length]);
          this.chats.push(tmpUser);
        });
      });
    });
    /*
this.chatService.getUserChatNew().subscribe(users => {
  let tmpUser:any={};
  console.log(users);
  let i=0;
  
              users.forEach(user => {
                console.log(user);

                /*
                if (!message.recieved){
                console.log(message);
                //this.chatService.setRecieved(this.uid, message.$key);
                console.log('primljeno svoje ili tuđe',users);
                if(message.senderID!=this.uid){
                  console.log('primljeno tuđe',users);
                  user.uid=message.senderID;
                  user.name=message.senderName;
                  user.surname=message.senderSurname;
                  user.new=true;
                  this.addUser(user, 2);
                  
                
              };  
                
                }
              });
              
              
              user.messages=msgs;
              user.noMsg=10;*/
             // })
//})
/*
this.chatService.getUserChat(this.uid).subscribe(msgs=>{
  let user:any={};
  console.log(msgs);
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
          //scroll to last msg 


});*/
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
         console.log("==>",element.key, uid);
           let objDiv = document.getElementById('content-'+i);
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
addGroup(group){
  console.log(group);
 let isGroupChat=false;
 this.groups.forEach(element => {
if(element.$key==group.$key){
  isGroupChat=true;
}
});
if (!isGroupChat){
    this.groups.push(group);
}
}

  addUser(user){
     
    user.$key=user.uid?user.uid:user.$key;
    let isUserChat=false;
this.users.forEach(element => {
if(element.$key==user.$key){
  isUserChat=true;
}
});
if (!isUserChat){
    this.users.push(user);
}
    this.chatService.setLastChats(user.$key);
  }
  
  openChat(gid, i){
    setTimeout(function(){ 
      let objDiv = document.getElementById('content'+i);
      if (objDiv){objDiv.scrollTop = objDiv.scrollHeight;}
     }, 0);
     
  }
  openUserChat(uid, i){
    //console.log(this.users);
    this.users.forEach(element => {
      if(element.$key==uid){
        this.chatService.getUserChatMsgs(uid).subscribe(msgs=>{
          element.messages=msgs;
        //  console.log(element, uid, msgs);
        });
      }
    });
    setTimeout(function(){ 
      let objDiv = document.getElementById('content-'+i);
      if (objDiv){objDiv.scrollTop = objDiv.scrollHeight;}
     }, 0);
     
  }
  sendMessage(gid, message, i){
    console.log(gid, message);
    let tmpMsg=new GroupMessage(this.uid, this.name, this.surname, message);
    this.chatService.sendGroupMessage(gid, tmpMsg);

  }
  sendUserMessage(uid, message){
//console.log(this.chats);
    let tmpMsg=new Message(this.uid, this.name, this.surname, message);
        console.log(tmpMsg);
//console.log(this.uid, uid);
    this.chatService.sendPrivateMessage(this.uid, uid, tmpMsg);
    this.chatService.sendPrivateMessage(uid, this.uid, tmpMsg);
  }

}
