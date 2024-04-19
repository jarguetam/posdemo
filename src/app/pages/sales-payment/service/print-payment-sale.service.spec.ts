import { TestBed } from '@angular/core/testing';

import { PrintPaymentSaleService } from './print-payment-sale.service';

describe('PrintPaymentSaleService', () => {
  let service: PrintPaymentSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintPaymentSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
