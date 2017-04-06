/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnitMultimediaComponent } from './unit-multimedia.component';

describe('UnitMultimediaComponent', () => {
  let component: UnitMultimediaComponent;
  let fixture: ComponentFixture<UnitMultimediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitMultimediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
