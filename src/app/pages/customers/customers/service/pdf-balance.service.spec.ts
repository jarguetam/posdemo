import { TestBed } from '@angular/core/testing';

import { PdfBalanceService } from './pdf-balance.service';

describe('PdfBalanceService', () => {
  let service: PdfBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
