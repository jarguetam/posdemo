import { TestBed } from '@angular/core/testing';

import { PrintInvoiceSaleService } from './print-invoice-sale.service';

describe('PrintInvoiceSaleService', () => {
  let service: PrintInvoiceSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintInvoiceSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
