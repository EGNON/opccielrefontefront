import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkRoleAccessGuard } from './check-role-access.guard';

describe('checkRoleAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkRoleAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
