/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DbCorrectionService } from './db-correction.service';

describe('DbCorrectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbCorrectionService]
    });
  });

  it('should ...', inject([DbCorrectionService], (service: DbCorrectionService) => {
    expect(service).toBeTruthy();
  }));
});
