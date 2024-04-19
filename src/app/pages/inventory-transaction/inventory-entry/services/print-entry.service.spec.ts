import { TestBed } from '@angular/core/testing';

import { PrintEntryService } from './print-entry.service';

describe('PrintEntryService', () => {
  let service: PrintEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
