import { Component, OnInit, Input } from '@angular/core';
import { WatchingService } from '../watching.service';
import { GroupService } from '../group.service';
import { Notification } from '../notification';


@Component({
  selector: 'app-watcher',
  templateUrl: './watcher.component.html',
  styleUrls: ['./watcher.component.css']
})
export class WatcherComponent implements OnInit {
  isOpen:boolean=false;
  notifications:any=[];
  noNew:number;
  @Input('uid')uid:any;

  constructor(private ws: WatchingService, private gs: GroupService) { }

  ngOnInit() {
    this.ws.getWatchers(this.uid).subscribe(
      

      watcher => {
        let i=0;
          this.notifications=[];

        watcher.forEach(element => {
          
          if(element.active){
            //this.notifications.push(element);
            
            let notification = new Notification(element.$key, element.type, element.gid, element.gName, element.uid);
            notification.solved=element.solved;
            if (!element.solved){notification.msg='<b>'+notification.msg+'</b>';i++;}
            this.notifications.push(notification);
          }
          
          
        });
        this.noNew=i;
        console.log(this.notifications, i);
      }
    );
  }
  openMsg(){
    this.isOpen=true;
  }
  closeMsg(){
    this.isOpen=false;
  }
  joinGroup(gid, key){
    this.ws.updateWatcher(this.uid, key, {solved:true});
    this.gs.joinUser(gid, this.uid);
  }
  dismiss(key){
      this.ws.archive(this.uid, key);
  }
}
