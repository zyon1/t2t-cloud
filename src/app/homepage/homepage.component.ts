import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
title = 'Dobrodošli na t2t.cloud';
  constructor() { }

  ngOnInit() {
  }

}
