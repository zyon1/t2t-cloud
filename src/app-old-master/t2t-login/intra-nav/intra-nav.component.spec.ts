/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IntraNavComponent } from './intra-nav.component';

describe('IntraNavComponent', () => {
  let component: IntraNavComponent;
  let fixture: ComponentFixture<IntraNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntraNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntraNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
