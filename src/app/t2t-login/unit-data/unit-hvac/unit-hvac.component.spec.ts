/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnitHvacComponent } from './unit-hvac.component';

describe('UnitHvacComponent', () => {
  let component: UnitHvacComponent;
  let fixture: ComponentFixture<UnitHvacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitHvacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitHvacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
