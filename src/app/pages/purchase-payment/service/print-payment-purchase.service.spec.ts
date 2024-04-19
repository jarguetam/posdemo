import { TestBed } from '@angular/core/testing';

import { PrintPaymentPurchaseService } from './print-payment-purchase.service';

describe('PrintPaymentPurchaseService', () => {
  let service: PrintPaymentPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintPaymentPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
