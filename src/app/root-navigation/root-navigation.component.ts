import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root-navigation',
  templateUrl: './root-navigation.component.html',
  styleUrls: ['./root-navigation.component.css']
})
export class RootNavigationComponent implements OnInit {
  auth:boolean=false;
  public fullPath:string;

getMyPicture(myPicture){
   this.fullPath = "../../img/"+ myPicture;
 }
  constructor(private router: Router) {
    this.getMyPicture('Logo_final_all-14.png');
   }

  ngOnInit() {
 //    this.router.events.subscribe(event => {
 //       if (event.constructor.name === 'NavigationEnd') {
 //         let patt=/login*/i;
 //         this.auth=event.url.search(patt)>-1;
 //         console.log('auth', this.auth);
 //         console.log(event.url);
 //       }
 //     });

  }

}
