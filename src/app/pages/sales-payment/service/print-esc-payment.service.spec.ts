import { TestBed } from '@angular/core/testing';

import { PrintEscPaymentService } from './print-esc-payment.service';

describe('PrintEscPaymentService', () => {
  let service: PrintEscPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintEscPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
