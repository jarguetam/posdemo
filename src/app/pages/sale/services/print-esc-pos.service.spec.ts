import { TestBed } from '@angular/core/testing';

import { PrintEscPosService } from './print-esc-pos.service';

describe('PrintEscPosService', () => {
  let service: PrintEscPosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintEscPosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
