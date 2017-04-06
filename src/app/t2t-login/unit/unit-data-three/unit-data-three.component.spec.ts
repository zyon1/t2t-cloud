/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnitDataThreeComponent } from './unit-data-three.component';

describe('UnitDataThreeComponent', () => {
  let component: UnitDataThreeComponent;
  let fixture: ComponentFixture<UnitDataThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDataThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDataThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
