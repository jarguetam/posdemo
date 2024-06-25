import { TestBed } from '@angular/core/testing';

import { InventoryReturnService } from './inventory-return.service';

describe('InventoryReturnService', () => {
  let service: InventoryReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
