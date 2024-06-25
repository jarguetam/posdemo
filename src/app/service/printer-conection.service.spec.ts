import { TestBed } from '@angular/core/testing';

import { PrinterConectionService } from './printer-conection.service';

describe('PrinterConectionService', () => {
  let service: PrinterConectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrinterConectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
