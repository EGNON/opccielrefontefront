import { TestBed } from '@angular/core/testing';

import { OperationrestitutionreliquatService } from './operationrestitutionreliquat.service';

describe('OperationrestitutionreliquatService', () => {
  let service: OperationrestitutionreliquatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationrestitutionreliquatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
