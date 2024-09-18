import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkPermissionAccessGuard } from './check-permission-access.guard';

describe('checkPermissionAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkPermissionAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
