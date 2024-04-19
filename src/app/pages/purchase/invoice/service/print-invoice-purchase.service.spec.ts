import { TestBed } from '@angular/core/testing';

import { PrintInvoicePurchaseService } from './print-invoice-purchase.service';

describe('PrintInvoicePurchaseService', () => {
  let service: PrintInvoicePurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintInvoicePurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
