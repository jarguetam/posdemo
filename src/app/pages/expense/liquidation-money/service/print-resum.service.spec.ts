import { TestBed } from '@angular/core/testing';

import { PrintResumService } from './print-resum.service';

describe('PrintResumService', () => {
  let service: PrintResumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintResumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
