import { Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  TemplateRef,
  Directive
 } from '@angular/core';



@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent implements OnInit, AfterViewInit {
@Input('content')content:any;
@Input('text')text:any;
@Input('open')open:boolean;
@Input('options')options:any;
@Output('action') action = new EventEmitter();
@ViewChild('modalBody') modalBody: ElementRef;
selectedAction:any='none';
/**
 * eg:
 * 
 * let exampleModalContent={title:'Title',text:'<div>some html</div>', buttons:[{action: 'both', text:'Zadrži obje'}, {action:'new', text: 'Zadrži novu', action:'old', text: 'Zadrži staru'}]};
 * let exampleOptions={
 * backdrop:boolean,
 * dispose:boolean; // dispose on backdrop
 * keyboard:number; // :TODO
 * 
 * 
 * };
 * 
 */

  constructor() {
     
   }
ngAfterViewInit(){
  this.modalBody.nativeElement.innerHTML = this.content.text;
}
  ngOnInit() {
  }
  emitAction(action){
    this.action.emit(action);

  }
}
@Component({
  selector: 'app-fc-modal-window',
  templateUrl: './fc-modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class fcModalComponent implements OnInit{
@Input('content')content:any;
@Input('text')text:any;
@Input('open')open:boolean;
@Input('options')options:any;
@Output('action') action = new EventEmitter();
@ViewChild('modalBody') modalBody: ElementRef;
selectedAction:any='none';
/**
 * eg:
 * 
 * let exampleModalContent={title:'Title',text:'<div>some html</div>', buttons:[{action: 'both', text:'Zadrži obje'}, {action:'new', text: 'Zadrži novu', action:'old', text: 'Zadrži staru'}]};
 * let exampleOptions={
 * backdrop:boolean,
 * dispose:boolean; // dispose on backdrop
 * keyboard:number; // :TODO
 * 
 * 
 * };
 * 
 */

  constructor() {
     
   }

  ngOnInit() {
  }
  emitAction(action){
    console.log(action);
    this.action.emit(action);

  }


}
