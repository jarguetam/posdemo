import { TestBed } from '@angular/core/testing';

import { PrintTransferService } from './print-transfer.service';

describe('PrintTransferService', () => {
  let service: PrintTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
