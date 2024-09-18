import { TestBed } from '@angular/core/testing';

import { ReportingsService } from './reportings.service';

describe('ReportingsService', () => {
  let service: ReportingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
