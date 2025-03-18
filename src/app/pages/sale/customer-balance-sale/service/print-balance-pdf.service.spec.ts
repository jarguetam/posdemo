import { TestBed } from '@angular/core/testing';

import { PrintBalancePdfService } from './print-balance-pdf.service';

describe('PrintBalancePdfService', () => {
  let service: PrintBalancePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintBalancePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
