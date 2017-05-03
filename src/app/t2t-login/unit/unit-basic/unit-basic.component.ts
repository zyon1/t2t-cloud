import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from '../../custom-select/custom-select.component';


@Component({
  selector: 'app-unit-basic',
  templateUrl: './unit-basic.component.html',
  styleUrls: ['./unit-basic.component.css']
})
export class UnitBasicComponent implements OnInit {
 unitTypes:any=['Soba', 'Studio apartman', 'Apartman'];
  constructor() { }
  
  ngOnInit() {
  }
  onSubmit(){}
}
