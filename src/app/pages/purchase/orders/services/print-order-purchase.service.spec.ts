import { TestBed } from '@angular/core/testing';

import { PrintOrderPurchaseService } from './print-order-purchase.service';

describe('PrintOrderPurchaseService', () => {
  let service: PrintOrderPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintOrderPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
