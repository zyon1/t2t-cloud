/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyObjectsComponent } from './my-objects.component';

describe('MyObjectsComponent', () => {
  let component: MyObjectsComponent;
  let fixture: ComponentFixture<MyObjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyObjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
