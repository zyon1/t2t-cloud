/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnitBathroomComponent } from './unit-bathroom.component';

describe('UnitBathroomComponent', () => {
  let component: UnitBathroomComponent;
  let fixture: ComponentFixture<UnitBathroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitBathroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitBathroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
