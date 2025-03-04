import { TestBed } from '@angular/core/testing';

import { OperationTransfertService } from './operation-transfert.service';

describe('OperationTransfertService', () => {
  let service: OperationTransfertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationTransfertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
