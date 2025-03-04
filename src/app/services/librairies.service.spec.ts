import { TestBed } from '@angular/core/testing';

import { LibrairiesService } from './librairies.service';

describe('LibrairiesService', () => {
  let service: LibrairiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibrairiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
