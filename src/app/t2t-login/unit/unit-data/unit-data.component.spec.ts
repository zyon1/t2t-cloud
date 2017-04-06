/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnitDataComponent } from './unit-data.component';

describe('UnitDataComponent', () => {
  let component: UnitDataComponent;
  let fixture: ComponentFixture<UnitDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
