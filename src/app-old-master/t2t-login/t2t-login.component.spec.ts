/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { T2tLoginComponent } from './t2t-login.component';

describe('T2tLoginComponent', () => {
  let component: T2tLoginComponent;
  let fixture: ComponentFixture<T2tLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T2tLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T2tLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
