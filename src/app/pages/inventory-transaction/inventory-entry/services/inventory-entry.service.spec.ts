import { TestBed } from '@angular/core/testing';

import { InventoryEntryService } from './inventory-entry.service';

describe('InventoryEntryService', () => {
  let service: InventoryEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
