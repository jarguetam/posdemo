import { TestBed } from '@angular/core/testing';

import { PrintOrderSaleService } from './print-order-sale.service';

describe('PrintOrderSaleService', () => {
  let service: PrintOrderSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintOrderSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
