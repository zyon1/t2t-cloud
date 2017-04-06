/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnitsWizzardService } from './units-wizzard.service';

describe('UnitsWizzardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitsWizzardService]
    });
  });

  it('should ...', inject([UnitsWizzardService], (service: UnitsWizzardService) => {
    expect(service).toBeTruthy();
  }));
});
