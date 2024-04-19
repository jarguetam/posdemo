import { TestBed } from '@angular/core/testing';

import { InventoryTypeService } from './inventory-type.service';

describe('InventoryTypeService', () => {
  let service: InventoryTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
