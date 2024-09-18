import { TestBed } from '@angular/core/testing';

import { OpcvmService } from './opcvm.service';

describe('OpcvmService', () => {
  let service: OpcvmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcvmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
