import { TestBed } from '@angular/core/testing';

import { PaymentSalesService } from './payment-sales.service';

describe('PaymentSalesService', () => {
  let service: PaymentSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
