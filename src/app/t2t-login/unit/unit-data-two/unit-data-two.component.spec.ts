/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnitDataTwoComponent } from './unit-data-two.component';

describe('UnitDataTwoComponent', () => {
  let component: UnitDataTwoComponent;
  let fixture: ComponentFixture<UnitDataTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDataTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDataTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
