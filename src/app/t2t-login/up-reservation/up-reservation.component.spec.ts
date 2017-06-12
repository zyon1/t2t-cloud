/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UpReservationComponent } from './up-reservation.component';

describe('UpReservationComponent', () => {
  let component: UpReservationComponent;
  let fixture: ComponentFixture<UpReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
