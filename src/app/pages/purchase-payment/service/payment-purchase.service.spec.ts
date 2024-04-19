import { TestBed } from '@angular/core/testing';

import { PaymentPurchaseService } from './payment-purchase.service';

describe('PaymentPurchaseService', () => {
  let service: PaymentPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
