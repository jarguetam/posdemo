import { TestBed } from '@angular/core/testing';

import { PrintRequestService } from '../print-request.service';

describe('PrintRequestService', () => {
  let service: PrintRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
