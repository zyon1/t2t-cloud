/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HavePermissionGuardService } from './have-permission-guard.service';

describe('HavePermissionGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HavePermissionGuardService]
    });
  });

  it('should ...', inject([HavePermissionGuardService], (service: HavePermissionGuardService) => {
    expect(service).toBeTruthy();
  }));
});
