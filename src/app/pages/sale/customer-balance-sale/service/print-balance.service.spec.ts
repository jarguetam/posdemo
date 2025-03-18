import { TestBed } from '@angular/core/testing';

import { PrintBalanceService } from './print-balance.service';

describe('PrintBalanceService', () => {
  let service: PrintBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
