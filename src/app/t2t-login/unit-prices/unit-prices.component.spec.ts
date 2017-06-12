/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnitPricesComponent } from './unit-prices.component';

describe('UnitPricesComponent', () => {
  let component: UnitPricesComponent;
  let fixture: ComponentFixture<UnitPricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitPricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
