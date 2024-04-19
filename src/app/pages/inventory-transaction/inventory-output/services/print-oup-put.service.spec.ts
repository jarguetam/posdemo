import { TestBed } from '@angular/core/testing';

import { PrintOupPutService } from './print-oup-put.service';

describe('PrintOupPutService', () => {
  let service: PrintOupPutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintOupPutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
