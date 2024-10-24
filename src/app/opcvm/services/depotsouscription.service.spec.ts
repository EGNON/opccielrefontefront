import { TestBed } from '@angular/core/testing';

import { DepotsouscriptionService } from './depotsouscription.service';

describe('DepotsouscriptionService', () => {
  let service: DepotsouscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotsouscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
